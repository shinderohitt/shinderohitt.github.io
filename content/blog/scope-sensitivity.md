+++
title = "Scope Sensitivity"
date = "2021-11-25T21:33:53+05:30"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."
tags = []
+++


### Timeline
- `Sun is born` 8.1 hours
- `Life emerges on earth` 7.1 hours
- `Earliest multicellular life` 3.7 hours
- `First air breathing animals` 44 minutes
- `First tree like plants` 40 minutes
- `First mammals` 24 minutes
- `First primates` 6.4 minutes
- `First modern birds` 5.8 minutes
- `Great apes and lesser apes diverge` 1.9 minutes
- `Last common ancestor humans and chimpanzees` 38 seconds
- `First members of the genus homo appear` 14 seconds
- `Anatomically modern humans appear in africa` 1.2 seconds
- `Humans move out of africa` 0.64 seconds
- `Neanderthals go instinct / first domesticated dogs` 0.24 seconds
- `Human civilisation begins` 0.038 seconds


The following setups are geared toward audio & visual development. When living at anchor, power is a critical resource aboard Pino, I prefer to work on a low-power SBC like Usagi otherwise my main workstation is Ayatori.


<!-- Load d3.js -->
<script src="https://d3js.org/d3.v6.js"></script>

<!-- Create a div where the graph will take place -->
<div id="universe_timeline" class="timeline">
    <div id="universe_timeline_donut"></div>
    <div id="universe_timeline_table" class="timeline_table">
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Time since then</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>foo</td>
                    <td>bar</td>
                </tr>
                <tr>
                    <td>baz</td>
                    <td>lala</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div id="earth_timeline" class="timeline">
    <div id="earth_timeline_donut"></div>
    <div id="earth_timeline_table" class="timeline_table">
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Time since then</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>foo</td>
                    <td>bar</td>
                </tr>
                <tr>
                    <td>baz</td>
                    <td>lala</td>
                </tr>
            </tbody>
        </table>
    </div>
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

// drawBarForTimeline(d3, universeTimeline, 'universe_timeline_bar', "c");

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

// drawBarForTimeline(d3, earthTimeline, 'earth_timeline_bar', "c");

</script>

<style>
 body {
     width: 100%;
 }

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

 .timeline, .timeline_table {
     display: flex;
 }

 .timeline_table {
     height: fit-content;
 }
</style>
