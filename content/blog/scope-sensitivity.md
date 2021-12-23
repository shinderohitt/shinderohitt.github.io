+++
title = "Visualising time relativeness"
date = "2021-11-25T21:33:53+05:30"

#
# description is optional
#
description = "An attempt to build a sense for time between major events in universe's history"
tags = ['time']
+++


## What is this?
What does a billion years mean to you? Does replacing years with something else help? It is hard for me to grasp that number. Our universe came into existence about 13.6 billion years ago. What does human existence mean in this timespan? What is a hundred years in this? (maybe your lifetime?). This is an attempt in trying to build a perspective for the time and in a way, large numbers.

## How?
We try two methods:
1. Map large numbers to smaller ones we can relate with (eg: one year as one second)
2. Some visualizations

<p style="margin-bottom: 32px;"></p>

You are thrown back in time -- to the very beginning of the universe. The time starts running just the way it did about fourteen billion years ago. You get to witness everything since then -- including Earth's birth. How long till you see your loved ones again?

The table below lists some major events since the big-bang. The other columns map these to some reasonable numbers, explained as below:

1. Imagine it is midnight, 12AM. This is when the big-bang happens. This tells at which time what happened.
2. If the last 6,000 years were to happen in a single day, how long would the other events take? Note: Human civilisation exists since last ~6,000 years. This column tells when would that event happen in future -- if we were to reverse to time.
3. What if we map 100 years (one human life) to a single second? How far back was each event?


<!-- Load d3.js -->
<script src="/js/d3.v6.min.js"></script>
<script src="/js/moment-2.29.1.min.js"></script>
<script src="/js/fabric.min.js"></script>

<!-- Create a div where the graph will take place -->
<div id="universe_timeline" class="timeline">
    <div id="universe_timeline_table" class="timeline_table">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Hour since midnight</th>
                    <th>6000y as 1 day</th>
                    <th>100y as 1s</th>
                </tr>
            </thead>
            <tbody id="universe_timeline_tbody"></tbody>
        </table>
    </div>
    <p>
        The pie charts below sadly attempt to show these numbers, how long was spent doing what since the big bang. Everything after "primates" is pointing to a single dot. Even though we are not able to see the difference in last several events, it still puts our existence in perspective?
    </p>
    <div id="universe_timeline_donut" class="timeline_donut"></div>
</div>

The difference between "recent" events is so little compared to the initial bang, that it is hard to visualise them. Genus homo started about two million years ago. That is about 0.0002 percent of the whole duration. Humans moved out of africa about a hundred thousand years ago. That is about 0.0000007 of the whole time. I don't know about you, but these numbers make no sense to me. The table below is limited to human existence. It is amazing even if we limit our scope to all of human existence, in terms of 24h, pyramids were built only 4 minutes ago!
<div id="earth_timeline" class="timeline">
    <div id="earth_timeline_table" class="timeline_table">
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Hour since midnight</th>
                    <th>6000y as 1 day</th>
                    <th>100y as 1s</th>
                </tr>
            </thead>
            <tbody id="earth_timeline_tbody"></tbody>
        </table>
    </div>
    <div id="earth_timeline_donut" class="timeline_donut"></div>
</div>

## Visualizing all of time
How to read:
- Left to right, top to bottom. It should be scrollable.
- The whole colored area put together represents all of time, about 14 billion years.
- The first box (top left) represents the last 300,000 years. This represents homo sapien's lifetime. 
- Everything else is in terms of that, ie, a single box of the size 300k years. 
- Each next color is inclusive of all of last ones. Eg: The second event `Genus homo` is colored as {}, but you should also consider all the ones that came before it (here, just one, the first rectangle).

<div class='grid-canvas-wrapper'>
    <canvas id="grid-vis"></canvas>
</div>

### TODO:
1. [ ] Replace numbers computing code with static numbers
2. [ ] Export D3, canvas visualizations to static SVGs
3. [ ] Improve styling -- mainly to assign static, and sensible colors in charts
<script src="/js/scale_blog/scale.js" type="text/javascript"></script>

<script type="text/javascript">

 drawPieForTimeline(
     d3,
     universeTimeline,
     'universe_timeline_donut',
     {
         height: pie_height,
         width: pie_width,
         margin: pie_margin
     }
 );
 drawPieForTimeline(
     d3,
     earthTimeline,
     'earth_timeline_donut',
     {
         height: pie_height,
         width: pie_width,
         margin: pie_margin
     }
 );

updateTables(universeTimeline, document.getElementById('universe_timeline_tbody'));
updateTables(earthTimeline, document.getElementById('earth_timeline_tbody'));

drawGridVisualisation('grid-vis', sapiensTimeline, 300000);

</script>

<style>

 svg text {
     font-weight: 200;
     font-size: 12px;
 }

 svg polyline{
     opacity: .3;
     stroke: black;
     stroke-width: 1px;
     fill: none;
 }

 #grid-vis {

 }
 
 .grid-canvas-wrapper {
     width: 95vw;
     position: relative;
     left: 55%;
     right: 50%;
     margin-left: -50vw;
     margin-right: -50vw;
     overflow: scroll; 
     overflow-y: auto;
 }
 
</style>
