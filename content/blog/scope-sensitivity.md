+++
title = "Scope Sensitivity"
date = "2021-11-25T21:33:53+05:30"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."
tags = []
+++

You are thrown back in time. To the very beginning of the universe. The time starts running just the way it did about fourteen billion years ago. You get to witness everything since then. How long till you see your loved ones again? The numbers are so unreasonably large that it is hard to _feel_ them, hard to grasp them. We will attemp to build some sense for them.

One way to tame these large numbers is to map them to something we can deal with. But even this doesn't always work for very large, or very small numbers. Here, we will map the events from big-bang to two timelines:

1. Imagine it is midnight, 12AM. This is when the big-bang happens and you witness it with your eyes. The table below lists some of the major events in our universe's timeline. It tells at which clock what happens.
2. Similarly, if we are to witness things happen in reverse (humans become monkeys instead of the other way around), and consider last six thousand years - which includes the known history of human civilisation - as a single day, when do we get to see the big bang?

<!-- Load d3.js -->
<script src="https://d3js.org/d3.v6.js"></script>
<script src="/js/moment-2.29.1.min.js"></script>

<!-- Create a div where the graph will take place -->
<div id="universe_timeline" class="timeline">
    <div id="universe_timeline_table" class="timeline_table">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Hour</th>
                    <th>Future day</th>
                </tr>
            </thead>
            <tbody id="universe_timeline_tbody"></tbody>
        </table>
    </div>
    <p>
        The pie chart below sadly attempts to show these numbers, how long was spent doing what since the big bang. Everything after *primates* is pointing to a single dot. This is (almost) useless.
    </p>
    <div id="universe_timeline_donut" class="timeline_donut"></div>
</div>

The difference between "recent" events are so very recent compared to the initial bang, that it is hard to visualise them using the usual methods. Genus homo started about two million years ago. That is about 0.0002 percent of the whole duration. Humans moved out of africa about hundred thousand years ago. That is about 0.0000007 of the whole time. I don't know about you, but these numbers make no sense to me. The table and the chart below are limited to couple of recent events. Using the same method as above.
<div id="earth_timeline" class="timeline">
    <div id="earth_timeline_table" class="timeline_table">
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Time since then</th>
                </tr>
            </thead>
            <tbody id="earth_timeline_tbody"></tbody>
        </table>
    </div>
    <div id="earth_timeline_donut" class="timeline_donut"></div>
</div>


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

</script>

<style>
 /* body {
    width: 100%;
    } */

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

 /* .timeline, .timeline_table {
    display: flex;
    } */

 /* .timeline_table {
    height: fit-content;
    } */

 /* .timeline_donut {
    width: 60%;
    }

    .timeline_table {
    width: 40%;
    } */
</style>
