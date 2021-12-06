+++
title = "Scope Sensitivity"
date = "2021-11-25T21:33:53+05:30"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."
tags = []
+++


<!-- Load d3.js -->
<script src="https://d3js.org/d3.v6.js"></script>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>

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
</style>

<script>

 // set the dimensions and margins of the graph
 const width = 600,
       height = 600,
       margin = 1;

 // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
 const radius = Math.min(width, height) / 2 - margin

 // append the svg object to the div called 'my_dataviz'
 const svg = d3.select("#my_dataviz")
               .append("svg")
               .attr("width", width)
               .attr("height", height)
               .append("g")
               .attr("transform", `translate(${width/2},${heIght/2})`);

 // Create dummy data
 const data = {
     a: 9,
     b: 20,
     c:30,
     d:8,
     e:12,
     f:3,
     g:7,
     h:14
 }

 const TOTAL_AGE = 14000000000.0
 const SECONDS_IN_DAY = 24 * 60 * 60

 let timeline = [
     //     ["14B", "Universe's birth",],
     /* ["4.57B", "Sun is born",],
      * ["4B", "Life emerges on earth",],
      * ["2.1B", "Earliest multicellular life",],
      * ["420M", "First air breathing animals",],
      * ["380M", "First tree like plants",],
      * ["225M", "First mammals",],
      * ["60M", "First primates",],
      * ["55M", "First modern birds",],
      * ["18M", "Great apes and lesser apes diverge",],
      * ["6M", "Last common ancestor humans and chimpanzees",], */
     ["2.2M", "First members of the genus homo appear",],
     ["0.195M", "Anatomically modern humans appear in africa",],
     ["0.1M", "Humans move out of africa",],
     ["0.038M", "Neanderthals go instinct / first domesticated dogs",],
     ["0.006M", "Human civilisation begins"]
 ];

 toYears = (timeSince) => {
     let multiplier = 1000000000.0;
     if (timeSince.endsWith("M")) {
         multiplier = 1000000.0;
     }

     inStr = timeSince.replace("B", "").replace("M", "");
     return parseFloat(inStr) * multiplier;
 }

 const toSeconds = years => (years / TOTAL_AGE) * SECONDS_IN_DAY;
 const percentOfTimeSinceBirth = years => (years / TOTAL_AGE) * 100;

 timeline = timeline
     .map(([timeSince, title]) => ({
         eventTitle: title,
         years: toYears(timeSince),
         seconds: toSeconds(toYears(timeSince)),
         percent: percentOfTimeSinceBirth(toYears(timeSince))
     }));


 // set the color scale
 const color = d3.scaleOrdinal()
                 .domain(timeline.map(t => t.seconds))
                 .range(d3.schemeDark2);

 // Compute the position of each group on the pie:
 const pie = d3.pie()
               .sort(null) // Do not sort group by size
               .value(d => d.seconds)

 const data_ready = pie(timeline)
 // console.log("foo", data_ready)

 // The arc generator
 const arc = d3.arc()
               .innerRadius(radius * 0.6)         // This is the size of the donut hole
               .outerRadius(radius * 0.8)

 const firstOuterArc = d3.arc()
                         .innerRadius(radius * 0.8)
                         .outerRadius(radius * 0.8)

 // Another arc that won't be drawn. Just for labels positioning
 const outerArc = d3.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9)

 // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
 svg
                    .selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data[1]))
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)

 // Add the polylines between chart and labels:
 /* svg
  *                    .selectAll('allPolylines')
  *                    .data(data_ready)
  *                    .join('polyline')
  *                    .attr("stroke", "black")
  *                    .style("fill", "none")
  *                    .attr("stroke-width", 1)
  *                    .attr('points', function(d) {
  *                        console.log(arc.outerRadius());
  *                        //                        let posA = arc.centroid(d); // line insertion in the slice
  *                        const posA = firstOuterArc.centroid(d)
  *                        const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
  *                        const posC = outerArc.centroid(d); // Label position = almost the same as posB
  *                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
  *                        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
  *                        return [posA, posB, posC]
  *                    })
  */
 // Add the polylines between chart and labels:
 /* svg
  *                    .selectAll('allLabels')
  *                    .data(data_ready)
  *                    .join('text')
  *                    .text(d => d.eventTitle)
  *                    .attr('transform', function(d) {
  *                        const pos = outerArc.centroid(d);
  *                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
  *                        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
  *                        return `translate(${pos})`;
  *                    })
  *                    .style('text-anchor', function(d) {
  *                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
  *                        return (midangle < Math.PI ? 'start' : 'end')
  *                    }) */
</script>


The first picosecond (10−12) of cosmic time. It includes the Planck epoch, during which currently established laws of physics may not apply; the emergence in stages of the four known fundamental interactions or forces—first gravitation, and later the electromagnetic, weak and strong interactions; and the expansion of space itself and supercooling of the still immensely hot universe due to cosmic inflation.
