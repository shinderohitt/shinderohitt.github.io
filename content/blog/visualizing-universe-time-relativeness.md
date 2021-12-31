+++
title = "Visualizing time relativeness"
date = "2021-11-25T21:33:53+05:30"

#
# description is optional
#
description = "An attempt in building a sense of time between major events in the history of universe"
tags = []
+++

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
 
 .grid-canvas-wrapper {
     width: 95vw;
     position: relative;
     left: 55%;
     right: 50%;
     margin-left: -50vw;
     margin-right: -50vw;
 }

span.text-inline-colors {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-bottom: -2px;
}
</style>
<!-- Load d3.js -->
<script src="/js/d3.v6.min.js"></script>
<script src="/js/moment-2.29.1.min.js"></script>
<script src="/js/fabric.min.js"></script>

## What is this?
What does a billion years mean to you? Does replacing years with something else help? It is hard to grasp that number. Our universe came into existence about 13.6 billion years ago. What does human existence mean in this timespan? This is an attempt in trying to build a perspective for the time and in a way, large numbers.

## How?
Let's try out two methods:
1. Map large numbers to smaller ones we can relate with. For example, one year becomes one second.
2. Some visualizations.

<p style="margin-bottom: 32px;"></p>

You are sent back in time -- to the very beginning of the universe. The time starts running the way it did about fourteen billion years ago. You get to witness everything since then -- including Sun's and Earth's birth. How long do you think you will have to wait to see your loved ones again? Can you relate to fourteen billion years?

## A model for large numbers
Let's try and build some analogies with numbers we can relate with. I think we can reasonably visualize what a 1000 means. Let's take some examples of 1000 and expand it to a million, then a billion.

#### Length
If we place some grains of rice in a row edge to edge, next to each  other, we can fit about 4 grains of rice in an inch. This number can change based on the variety of rice used. One thousand grains would  make about 20 feet (6.4 meters). What is 20 feet to us? We can fit about  4 people laying on the ground head to toe, one after other (about 5 feet in height, relatively short). Or we can make two rows of  grains in a room from one wall to the next one opposite to it.

What if it's a million grains? It's about 20,000 feet (6.4 kilometers - approx distance between your home and office?). Enough to make 2000 rows from one wall to the next, or have 4000 people laying on ground same as above.

One billion grains of rice next to each other would be 20,000,000 feet.  About 6,400 kilometers. Two rows of grains from a north point to the south of India -- from Shimla to Kanyakumari. In this distance, we can  have about 4 million people on ground next each other head to toe.

**Recap**:

- **One thousand**: One row of rice grains in your room from one wall to the next wall in your bedroom
- **One million**: Ten thousand rows in your room, or a single row between your home and office (6.4 kilometers)
- **One billion**: One row of grains from the north end of India till its south end.

#### Volume
- **Thousand**: We can fit about 1000 grains of rice in a cube inch.
- **Million**: Now if we make a one inch thick layer on the ground, we would have about 20 million grains of rice in your room. By dividing it with 20 we get a million. It should be as large as a single floor tile.
- **Billion**: A room full of rice grains should be about one billion.

#### 1 vs 1000
<div class='grid-canvas-wrapper2' id='scale-vis-wrapper'>
    <canvas id="scale-vis"></canvas>
</div>

> **Note**: \
> 1 thousand = 1 x 1000 \
> 1 million =  1 thousand x 1000 \
> 1 billion = 1 million x 1000

#### Pictures for reference:
One cube inch rice
![One cube inch of rice grains!](/images/scale-blog/one-cube-inch-rice.jpeg "One cube inch of rice grains")

Distance between Shimla and Kanyakumari
![A google maps view of the distance between Shimla and Kanyakumari!](/images/scale-blog/shimla-to-kanyakumari-google-maps.jpeg "A google maps view of the distance between Shimla and Kanyakumari")

## Relating with events since the big bang
Back to the big-bang. The table below lists some of the major events. The other columns map these to some reasonable numbers, explained as below:

1. Imagine it is midnight, 12AM. This is when the big-bang happens. This tells at which time what happened.
2. If the last 6,000 years were to happen in a single day, how long would the other events take? Note: Human civilization exists since last ~6,000 years. This column gives future dates for these events -- if we were to reverse the time.
3. What if we map 100 years (one human life) to a single second? How far back was each event?

Notice some interesting numbers in the second column:\
If all the time were only 24 hours: Thanks to a random mutation, we separated from chimpanzees only about 38 seconds ago, but we still had a _long_ way to go before we become [modern humans](https://en.wikipedia.org/wiki/Early_modern_human). We exist in that last one second. As a sidenote: we need to split that second in chunks to generate separate distinct numbers for last couple of events.


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
        What we are essentially doing in the table above is mapping a very large range of numbers to smaller ones, so that we can relate with them. Eg: 10 becomes 1. In the 24h case, we don't have enough items to map to, that is why we would have to split that one second in the last few events (resulting in large scope). We have 84,600 seconds in a day, ~2.2 million days in 6,206 years, and ~123 million seconds in 4 years.
    </p>
    <p>
        The pie charts below attempts to show these numbers, how much time was spent in doing what since the big bang. Everything after "primates" is pointing to a single dot. Does it help in any way put things in perspective?
    </p>
    <div id="universe_timeline_donut" class="timeline_donut"></div>
</div>

The difference between most recent events is so little compared to the initial ones, that it is hard to visualize them. Genus homo started about two million years ago. That is about 0.0002 percent of the whole duration. Humans moved out of Africa about a hundred thousand years ago. That is about 0.0000007 of the whole time. I don't know about you, but these numbers make no sense to me. The table below is limited to human existence. Even though we are looking at only human existence: in terms of 24h, the pyramids were built only 4 minutes ago! We have a computer at home since last 2 seconds, and an iPhone less than a second ago.
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

## Visualizing all the time
The picture below approximately visualizes all time. The first block  represents the last ~300,000 years. That includes all the time since  when we (the homo sapiens) exist. The last 300k years is quite rich and complex in itself, but we are going to ignore that - to get a bird's eye. Trying to compare that little box with the regions below may help in building a perspective.


> It's a long scroll down below -- before you scroll to the bottom and leave this page, lets revisit rice for a bit\
>\
> Can you imagine fourteen rooms tightly packed with rice? Your life is not more than 100 grains (or however many years you're left with). The paper box above has ~1000 grains, and its only an inch (~2.5 cm) in size.





<div class='grid-canvas-wrapper' id='grid-vis-wrapper'>
    <canvas id="grid-vis"></canvas>
</div>

<div id="sapiens_timeline" class="timeline">
    <div id="sapiens_timeline_table" class="timeline_table">
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Years since</th>
                    <th>Color</th>
                </tr>
            </thead>
            <tbody id="sapiens_timeline_tbody"></tbody>
        </table>
    </div>
</div>

## References, and inspirations
1. [Metamagical Themas](https://www.amazon.in/Metamagical-Themas-Questing-Essence-Pattern-ebook/dp/B06XCJFHB5) - Douglas Hofstadter. The **Number numbness** chapter from the book is an absolute must read -- consider this page a billionth part of it when it comes to quality, clarity, impact, and the value it carries.
2. [The machinary of life](https://www.amazon.in/Machinery-Life-David-S-Goodsell/dp/0387849246) - David Goodsell -- page 3, 4 is enough.
3. [Chronology of the universe](https://en.wikipedia.org/wiki/Chronology_of_the_universe), links to some nice visualizations and other interesting articles.
4. [A tweet](https://twitter.com/Rainmaker1973/status/1352587177310486534)


<script src="/js/scale_blog/scale.js" type="text/javascript"></script>
<script type="text/javascript">


 drawPieForTimeline(
     d3,
     universeTimeline,
     'universe_timeline_donut',
     {
         height: pie_height,
         width: pie_width,
         margin: pie_margin,
         viewbox: '0 0 600 400',
         translate: 'translate(300,280)'
     }
 );
 drawPieForTimeline(
     d3,
     earthTimeline,
     'earth_timeline_donut',
     {
         height: pie_height,
         width: pie_width,
         margin: pie_margin,
         viewbox: '0 0 700 340',
         translate: 'translate(350,200)'
     }
 );

updateTables(universeTimeline, document.getElementById('universe_timeline_tbody'));
updateTables(earthTimeline, document.getElementById('earth_timeline_tbody'));

 updateGridVisualisationTable(sapiensTimeline.reverse(), document.getElementById('sapiens_timeline_tbody'));

 const gridRectSize = 10
 const widthForGrid = document.getElementById('grid-vis-wrapper').getBoundingClientRect().width - gridRectSize;
 drawGridVisualisation(
     'grid-vis',
     {
         width: widthForGrid,
         timeline: sapiensTimeline.reverse().map(t => ({...t})),
         yearsBlock: 300000
     }
 );

 const scaleDummyTimeline = [{
     eventTitle: '1 million',
     color: darkColors[0],
     years: 1000
 }, {
     eventTitle: '1 billion',
     color: darkColors[1],
     years: 1000000
 }];

 const widthForScaleGrid = document.getElementById('scale-vis-wrapper').getBoundingClientRect().width - gridRectSize;

 drawGridVisualisation(
     'scale-vis',
     {
         width: Math.min(widthForScaleGrid, 700),
         timeline: scaleDummyTimeline.reverse(),
         yearsBlock: 1000
     }
 );
</script>

