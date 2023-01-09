
+++
title = "Counting Numbers: A Debugging Story"
date = "2023-01-08T10:21:26+05:30"
katex = true
#
# description is optional
#
description = "A story about how we figured out issues in an ad system, and fixed it. This involved tools like Apache Kafka, Redis, BigQuery."

tags = []
+++


### What is ads?
In an ad system, there are three main entities. A business which wants to show an ad to people, the group of people who are eligible to see that ad, and the platform which ties both the parties. The platform generally charges money to businesses based on the number of views, or clicks the ad gets.

[Goto](https://www.gotocompany.com/) is a fat app, and serves many use-cases. You can order food, a ride, or pay for things, and more. The app serves a lot of users (10s of millions). The ads team at Goto monetizes some of the pages within the app by serving ads.

### Why do we need to count the numbers?
How do you charge money? It's based on *the number of views* the platform can get for an ad. That involves counting numbers. A business asks a simple question, "How many people saw my ad campaign today?". Well, it's a number, and the platform needs to keep a counter against that ad.

### So what was the problem?
When I joined the ad team, an issue was brought to tech team's attention: Some campaigns were not getting enough impressions (starving), while others were getting more than necessary. More than necessary means the platform is losing money. The same view could have been served to the starving campagin and there would be more money.

#### Some lingo
Before we proceed further, let me set up some terms. Maybe refer these whenever confused because of an unfamiliar term.
- `Impression`: An event that's generated against an ad campaign when a user sees the ad, or clicks on it
- `Units purchased`: When a business creates an ad, they buy a fixed number of impressions. Something like, "Hey platform, give me 10,000 views today for my campaign X"
- `Campaign starvation`: A campagin is getting way less impressions than the units purchased.
- `Inventory utilisation`: Let's say a page in the app can generate 30 million events in a day, how many of these views are generating money for the platform? $$\text{utilisation rate} = \frac{\text{total billed impressions}}{\text{total impressions across all campaigns}}$$
- I may be using the words "ad", "ad campaign", or "campaign" interchangeably. They mean the same thing.

### Architecture
Now before we point out issues with the setup, lets quickly paint what system looked like.

<div style="display: flex; justify-content: center;">
    <img width="50%" src="/images/counting-numbers-a-debugging-story/high-level.svg" />
</div>

As described above, the communication between three entities is captured by this high level diagram above. Below is a detailed architecture. Henceforth, we will ignore the campagin creation flow and focus on impression counting and campaign serving.

<img src="/images/counting-numbers-a-debugging-story/old-architecture.svg" />

So, what's happening in this?
1. The mobile app used by consumers send an event (view, or click ~ impression) to an internal service called Clickstream.
2. This service puts these events on a kafka topic. Let's call it topic 1. Now the app is huge, and all sorts of events are recorded, all of them end up on topic 1. The ads impressions are a subset of them.
3. [Dagger](https://odpf.github.io/dagger/) essentially acted as a filter on top of topic 1. It picked the relevant impression events and put them on another kafka topic. Let's call it topic 2.
4. The consumer on topic 2 picked up these events, and kept a time window against each user session and aggregated counts against each campaign (more on this below).
5. The redis box is where the state of `campaign: impression counts <number>` state lived.

Here is how the event message (on kafka) looked like:
```javascript
{
  campaign_id: <UUID>, // To identify the campaign against which this was generated
  user_id: <UUID>,
  session_id: <UUID>,
  event_type: <"CLICK" | "VIEW">, // Type of the impression
  event_timestamp: <unix_epoch>
}
```

### What is time window? (point 4 above)
- If the same user sees the same ad twice within a 40 second window, we had to count that as once.
- The window size is different for clicks, and views. The idea is roughly the same.

### How did counts work?
This will mostly talk about the consumer on topic 2.
1. Pick a batch of events
2. Generate a list of keys for every message (to deduplicate events which fall within 40 seconds). Let's call  them _dedup keys_. This was essentially a function of: `campaign_id + user_id + event_type + time window identifier`, where
$$\text{time window identifier} = \Big\lfloor{\frac{\text{unix epoch timestamp}}{40}}\Big\rfloor \times 40$$
3. Now check which of these dedup keys exist in Redis.
4. Now filter out those campaign_ids from the original batch of messages, whose dedup keys exist in Redis.
5. For filtered campaigns, make another batch call to Redis, and increment counts for them.
6. Now for the same list of campaign_ids, set dedup keys in Redis - so if you see another event which falls within the same window, we don't count that twice (step 4 in this list).

### Back to the problem
- Why was the system serving some campaigns 100s of thousands of times even though it had asked for only 15k events?
- Why some campaigns were getting zero impressions?

The overall effect of this was that the effective utilisation rate of the ads was ~40%. Which should have been at least 85% or above.

- First thing we noticed was that the lag on topic 1 was huge. At peak, it reached 300 million. At night the consumer kept chugging at it, and by morning it would come down to zero. But as the day progressed, it would grow again and reach 100s of millions. It essentially looked like a sine wave for days of data.
- What would be the impact of this lag on the system? Essentially you are counting impressions later than real time.
- Let's say there's a campaign which has purchased 15k impressions for the day.
- At 10am, it has already seen those impressions. But the system is lagging behind, it doesn't yet know that the campaign has been served all of its impressions and it should be deactived. The impact of deactivating that campaign is, some other campaign would take its spot.
- The delay essentially meant we are inefficient in making all the money out of the ad page that we could. We can't charge a business for 300k impressions if they've only asked for 15k. Those 285k impressions could've been served to the other campaign which is still at zero.

### To fix the lag
- We increased the number of threads on Dagger, and the lag on topic 1 started going down. But the side effect was it started building up on topic 2. The Redis could not keep up with the increased load.
- To fix that, we introduced more Redis boxes and partitioned the data on campaign_id. The change looked like this:

<img src="/images/counting-numbers-a-debugging-story/new-architecture.svg" />

- After this the lag on both topics went down. Everything was normal, all dashboards green.
- Yet, the problem still persisted. There was no impact on the utilisation.
- The mystery forced us to look at data, and the two points that stood out were:

> The average number of impressions a campaign could receive in 1 minute: 15,000
> The average number of impressions a campaign purchased for a day: 16,000

So roughly the same numbers. What it means is you could burn through all of campaign's impressions in a minute - this would be the worst case, there were other complexities that decided which campaign to serve. We're not talking about them here.

### Is your cron running frequent enough?
- We had to deactivate the campagins which have already received enough impressions. That was done by a cron job periodically.
- For all active campaigns, it fetched the current impression count from Redis. If the count was more than units purchased, it deactivated the campagin by updating its `active` flag to `false` in ElasticSearch.
<img src="/images/counting-numbers-a-debugging-story/cron.svg" />
- And so the campaign would start showing up and getting any more impressions.
- What would happen if this job is running at every 30th minute? (Refer the numbers above)
- In the worst case, we let the campaign be served for 30 minutes even after it has received enough impressions already!
- So in terms of numbers: a campaign asking for 15k impressions could potentially get 15,000 x 30 = 450,000 impressions!
- We immediately reduced the frequency to 1 minute.
- This finally gave us some positive results, but there was still not ideal.
- Another optimisation was to deactivate campaigns prematurely, lets say at 70% instead of 100% of fulfilment. Imagine a campaign having received 12k events at 59th second. The cron runs, and does not deactivate the campaign. Now it gets visibility for another minute. That can potentially add another 15k impressions. So even though the campaign is asking for 15k impressions in total, we give it 27k.

### Is the TTL long enough?
- We had to set a TTL on the dedup keys I talked about above. For an ever increasing data, a cache without TTL (or some eviction policy) would run out of memory.
- We found out the TTL for that was set to 40 seconds - same as the window size!
- In this case, if the aggregator saw an event even one second late, it would count that event twice! Let me explain:

<img src="/images/counting-numbers-a-debugging-story/timeline.svg" />


- As soon as you see an event, you mark that with its dedup key in Redis. You set it to expire after 40 seconds.
- If you continue to see more events within those 40 seconds, they are ignored.
- If you see an event that crosses that boundary of 40 seconds, you would count that event twice. This may be a bit confusing to understand because, isn't that not what we want to do? keep a 40 second window? It's correct, but the events can be delayed.
- Assume all green lines above are events generated within the same 40 second time window, but the gap between first event and the last event was wider than 40 seconds: All of the events that fall within 40 seconds of the first event would be counted as 1 + the last event because it crosses the boundary. Ideally all of them should be 1.
- To fix this, we increased the TTL to 30 minutes. This provided a good enough tolerance for delayed events.
- This issue was a bit sneaky, and the impact wasn't directly seen. This essentially ballooned impressions for some systems in Redis, but on BQ they were lower. This change brought a significant improvement in bringing parity with BQ numbers.

### Get rid of the TTL, make counters idempotent - HyperLogLog
> Unique items can be difficult to count. Usually this means storing every unique item then recalling this information somehow. With Redis, this can be accomplished by using a set and a single command, however both the storage and time complexity of this with very large sets is prohibitive. HyperLogLog provides a probabilistic alternative.
- This allowed us moving away from the _dedup key_, so there was no question of expiring it with some TTL.
- Each operation became idempotent. You can't add the same item to a set multiple times. The set would deduplicate it for you.
- We only had to use two HyperLogLog commands to get this done:
    - `PFADD <campaign_id:date> <dedup key>` (dedup key is exactly same as above). This increments the cardinality of the set, if the dedup key is the same. Recall that all impression events whose event_timestamp falls in the same 40s window 
    - `PFCOUNT <campaign_id:date>` To get the impressions against a campaign for a given day.
- With this, we reduced the calls to Redis by 2/3. From checking dedup keys, incrementing counters, updating dedup keys to only incrementing counters.
- HLL spec: The Redis HyperLogLog implementation uses up to 12 KB and provides a standard error of 0.81%. Antirez has [an article](http://antirez.com/news/75) about it, links to papers.

### Summary and conclusion
- This involved figuring out kafka topic delays and their impact, figuring out bottlenecks that were involved in increasing event consumption.
- Looking at data and figuring out the average number of impressions a campaign purchased for a day, and the potential number of impressions a campaign could get in a minute.
- Figuring out cron's frequency and its relation with overserving, or underserving.
- Understanding TTL, and its impact. Prematurely deactivating campaigns.
- Experimenting with and migrating to a setup using HyperLogLog.
- The impact of all this work was additional X million USD to the revenue. People were happy with the inventory utilisation rate, which went from 40% to 85%+.
