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

<!-- CONSTANTS, DATA -->
<script type="text/javascript">
 // set the dimensions and margins of the graph
 const pie_width = 500,
       pie_height = 500,
       pie_margin = 1;

 // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
 const pie_radius = Math.min(pie_width, pie_height) / 2 - pie_margin - 100;

 const DONUT_OUTER_RADIUS = pie_radius * 0.8;
 const DONUT_INNER_RADIUS = pie_radius * 0.6;
 const OUTER_ARC_RADIUS = pie_radius * 0.9;

 const TOTAL_AGE = 13600000000.0;
 const SECONDS_IN_DAY = 24 * 60 * 60;

 let timeline = [
     //     ["14B", "Universe's birth"],
     ["4.57B", "Sun is born"],
     ["4B", "First life"],
     ["2.1B", "Multicellular life"],
     ["420M", "First air breathing animals"],
     ["380M", "Trees"],
     ["225M", "First mammals"],
     ["60M", "First primates"],
     ["55M", "First modern birds"],
     ["18M", "Great apes and lesser apes diverge"],
     ["6M", "Last common ancestor humans and chimpanzees"],
     ["2.2M", "First members of the genus homo appear"],
     ["0.195M", "Anatomically modern humans appear in africa"],
     ["0.1M", "Humans move out of africa"],
     ["0.038M", "Neanderthals go instinct / first domesticated dogs"],
     ["0.006M", "Human civilisation begins"]
 ];
</script>

<!-- Create a div where the graph will take place -->
<div id="universe_timeline">
    <div id="universe_timeline_donut"></div>
    <div id="universe_timeline_bar"></div>
</div>

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



<!-- Utilities for this page -->
<script type="text/javascript">
 toYears = (timeSince) => {
     const endsWith = timeSince[timeSince.length - 1];
     const multipliers = {
         "K": 1000.0,
         "M": 1000000.0,
         "B": 1000000000.0
     };

     let numberInStr = timeSince;
     if (endsWith in multipliers) {
         numberInStr = numberInStr.replace(endsWith, "");
     }


     const multiplier = multipliers[endsWith] || 1.0;
     return parseFloat(numberInStr) * multiplier;
 }

 const toSeconds = years => (years / TOTAL_AGE) * SECONDS_IN_DAY;
 const percentOfTimeSinceBirth = years => (years / TOTAL_AGE) * 100;

 const randomColors = (total) =>
     [...Array(total).keys()]
         .map(x => `#${Math.floor(Math.random()*16777215).toString(16)}`);

</script>

<script type="text/javascript">
 const svg = d3.select("#universe_timeline_donut")
               .append("svg")
               .attr("width", pie_width)
               .attr("height", pie_height)
               .append("g")
               .attr("transform", `translate(${pie_width/2},${pie_height/2})`);

 timeline = timeline
     .map(([timeSince, title]) => ({
         eventTitle: title,
         years: toYears(timeSince),
         seconds: toSeconds(toYears(timeSince)),
         percent: percentOfTimeSinceBirth(toYears(timeSince))
     }));

 timeline.forEach(({eventTitle, seconds}) => {
     const mins = seconds / 60;
     const hours = mins / 60;
     let time = 0;
     if (mins < 1) {
         time = `${seconds.toPrecision(2)} seconds`;
     } else if (hours < 1) {
         time = `${mins.toPrecision(2)} minutes`;
     } else {
         time = `${hours.toPrecision(2)} hours`;
     }
 });

 // set the color scale
 const colorRange = randomColors(timeline.length);
 const color = d3.scaleOrdinal()
                 .domain(timeline.map(t => t.seconds))
                 .range(colorRange);

 // Compute the position of each group on the pie:
 const pie = d3.pie()
               .sort(null) // Do not sort group by size
               .value(d => d.seconds)

 const data_ready = pie(timeline)

 // The arc generator
 const arc = d3.arc()
               .innerRadius(DONUT_INNER_RADIUS)         // This is the size of the donut hole
               .outerRadius(DONUT_OUTER_RADIUS);

 // Another arc that won't be drawn. Just for labels positioning
 const outerArc = d3.arc()
                    .innerRadius(pie_radius * 0.9)
                    .outerRadius(pie_radius * 0.9)

 // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
 svg
                    .selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data.seconds))
                    .attr("stroke", "white")
                    .style("stroke-width", "0px")
                    .style("opacity", 0.7)

 // Add the polylines between chart and labels:
 svg
                    .selectAll('allPolylines')
                    .data(data_ready)
                    .join('polyline')
                    .attr("stroke", "black")
                    .style("fill", "none")
                    .attr("stroke-width", 1)
                    .attr('points', function(d) {
                        let rad = DONUT_OUTER_RADIUS;
                        const posA = [Math.cos(d.endAngle - Math.PI*0.5) * rad, Math.sin(d.endAngle - Math.PI*0.5) * rad];
                        const posB = [Math.cos(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS, Math.sin(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS];
                        const posC = [Math.cos(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS, Math.sin(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS];

                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                        posC[0] = OUTER_ARC_RADIUS * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                        return [posA, posB, posC]
                    })

 // Add the polylines between chart and labels:
 svg
                    .selectAll('allLabels')
                    .data(data_ready)
                    .join('text')
                    .text(d => d.data.eventTitle)
                    .attr('transform', function(d) {
                        const pos = [Math.cos(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS, Math.sin(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS];
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                        pos[0] = OUTER_ARC_RADIUS * 0.99 * (midangle < Math.PI ? 1 : -1);
                        return `translate(${pos})`;
                    })
                    .style('text-anchor', function(d) {
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                        return (midangle < Math.PI ? 'start' : 'end')
                    })
</script>
<script>

 // append the svg object to the div called 'my_dataviz'
 const svg = d3.select("#universe_timeline_donut")
               .append("svg")
               .attr("width", pie_width)
               .attr("height", pie_height)
               .append("g")
               .attr("transform", `translate(${pie_width/2},${pie_height/2})`);

 timeline = timeline
     .map(([timeSince, title]) => ({
         eventTitle: title,
         years: toYears(timeSince),
         seconds: toSeconds(toYears(timeSince)),
         percent: percentOfTimeSinceBirth(toYears(timeSince))
     }));

 timeline.forEach(({eventTitle, seconds}) => {
     const mins = seconds / 60;
     const hours = mins / 60;
     let time = 0;
     if (mins < 1) {
         time = `${seconds.toPrecision(2)} seconds`;
     } else if (hours < 1) {
         time = `${mins.toPrecision(2)} minutes`;
     } else {
         time = `${hours.toPrecision(2)} hours`;
     }
 });

 // set the color scale
 const colorRange = randomColors(timeline.length);
 const color = d3.scaleOrdinal()
                 .domain(timeline.map(t => t.seconds))
                 .range(colorRange);

 // Compute the position of each group on the pie:
 const pie = d3.pie()
               .sort(null) // Do not sort group by size
               .value(d => d.seconds)

 const data_ready = pie(timeline)

 // The arc generator
 const arc = d3.arc()
               .innerRadius(DONUT_INNER_RADIUS)         // This is the size of the donut hole
               .outerRadius(DONUT_OUTER_RADIUS);

 // Another arc that won't be drawn. Just for labels positioning
 const outerArc = d3.arc()
                    .innerRadius(pie_radius * 0.9)
                    .outerRadius(pie_radius * 0.9)

 // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
 svg
                    .selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data.seconds))
                    .attr("stroke", "white")
                    .style("stroke-width", "0px")
                    .style("opacity", 0.7)

 // Add the polylines between chart and labels:
 svg
                    .selectAll('allPolylines')
                    .data(data_ready)
                    .join('polyline')
                    .attr("stroke", "black")
                    .style("fill", "none")
                    .attr("stroke-width", 1)
                    .attr('points', function(d) {
                        let rad = DONUT_OUTER_RADIUS;
                        const posA = [Math.cos(d.endAngle - Math.PI*0.5) * rad, Math.sin(d.endAngle - Math.PI*0.5) * rad];
                        const posB = [Math.cos(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS, Math.sin(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS];
                        const posC = [Math.cos(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS, Math.sin(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS];

                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                        posC[0] = OUTER_ARC_RADIUS * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                        return [posA, posB, posC]
                    })

 // Add the polylines between chart and labels:
 svg
                    .selectAll('allLabels')
                    .data(data_ready)
                    .join('text')
                    .text(d => d.data.eventTitle)
                    .attr('transform', function(d) {
                        const pos = [Math.cos(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS, Math.sin(d.endAngle - Math.PI*0.5) * OUTER_ARC_RADIUS];
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                        pos[0] = OUTER_ARC_RADIUS * 0.99 * (midangle < Math.PI ? 1 : -1);
                        return `translate(${pos})`;
                    })
                    .style('text-anchor', function(d) {
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                        return (midangle < Math.PI ? 'start' : 'end')
                    })
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
</style>
