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

The table below lists some major events since the big-bang. The other columns map these to some reasonable numbers, explained as below:

1. Imagine it is midnight, 12AM. This is when the big-bang happens. This tells at which time what happened.
2. If the last 6,000 years were to happen in a single day, how long would the other events take? Note: Human civilization exists since last ~6,000 years. This column gives future dates for these events -- if we were to reverse the time.
3. What if we map 100 years (one human life) to a single second? How far back was each event?


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
    Notice the last four rows in the second column. Last four events happen about one second! The reason this doesn't happen in the next two columns is because we are mapping all this time to bigger ranges. 84,600 seconds in a day, ~2.2 million days in 6,206 years, and ~123 million seconds in 4 years.
    </p>
    <p>
        The pie charts below attempts to show these numbers, how much time was spent in doing what since the big bang. Everything after "primates" is pointing to a single dot. How does that make you feel? Does it help in any way put things in perspective?
    </p>
    <div id="universe_timeline_donut" class="timeline_donut"></div>
</div>

The difference between most recent events is so little compared to the initial ones, that it is hard to visualize them. Genus homo started about two million years ago. That is about 0.0002 percent of the whole duration. Humans moved out of Africa about a hundred thousand years ago. That is about 0.0000007 of the whole time. I don't know about you, but these numbers make no sense to me. The table below is limited to human existence, to reduce the scope and make those last events visible. Even though we are looking at only human existence: in terms of 24h, the pyramids were built only 4 minutes ago!
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
How to read:
- Left to right, top to bottom. It should be scrollable.
- The whole colored area put together represents all time, 13.6 billion years.
- The first box (top left) represents the last 300,000 years. This represents homo sapien's lifetime. 
- Everything else is in terms of that, ie, a single box of the size 300k years. 
- Each next color is inclusive of all of last ones. Eg: The third event `First life` is colored as <span class="text-inline-colors" id="sapiens-timeline-2"></span>, but you should also consider all the ones that came before it.  (<span class="text-inline-colors" id="sapiens-timeline-0"></span>, and <span class="text-inline-colors" id="sapiens-timeline-1"></span>).

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
1. The _Number Numbness_ column from Douglas Hofstadter's [Metamagical Themas](https://en.wikipedia.org/wiki/Metamagical_Themas)
2. [Chronology of the universe](https://en.wikipedia.org/wiki/Chronology_of_the_universe), links to some nice visualizations and other interesting articles.
3. [This tweet](https://twitter.com/Rainmaker1973/status/1352587177310486534)

### TODO:
1. [x] Optimise rendering the grid visualization
2. [ ] Replace number computation in browser, with static numbers
3. [x] Improve styling -- mainly to assign static, and sensible colors in charts
4. [ ] Update text, add some details, walk readers through some numbers

<script src="/js/scale_blog/scale.js" type="text/javascript"></script>
<script type="text/javascript">

document.getElementById('sapiens-timeline-2').style.backgroundColor = sapiensTimeline[sapiensTimeline.length-3].color;

document.getElementById('sapiens-timeline-0').style.backgroundColor = sapiensTimeline[sapiensTimeline.length-1].color;

document.getElementById('sapiens-timeline-1').style.backgroundColor = '#FFF';

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
drawGridVisualisation('grid-vis', sapiensTimeline.reverse().map(t => ({...t})), 300000);
</script>

