// constants and data to render; some manage configs
//const TOTAL_AGE = 13600000000.0;
const TOTAL_AGE = 380000000.0;
const AGE_SINCE_EARTH = 4500000000.0;
const SECONDS_IN_DAY = 24 * 60 * 60;

const pie_width = 500,
      pie_height = 500,
      pie_margin = 1;

let universeTimeline = [
    ["14B", "Universe's birth"],
    ["4.57B", "Sun is born"],
    ["4B", "First life"],
    ["2.1B", "Multicellular life"],
    ["420M", "Breathing animals"],
    ["380M", "Trees"],
    ["225M", "Mammals"],
    ["60M", "Primates"],
    ["55M", "Modern birds"],
    ["18M", "Great apes"],
    ["6M", "Lisa"],
    ["2.2M", "Genus homo"],
    ["0.195M", "Anatomically modern humans"],
    ["0.1M", "Out of africa"],
    ["0.038M", "Neanderthals :skull:"],
    ["0.006M", "Civilisation begins"]
];

let earthTimeline = [
    ["4B", "First life"],
    ["2.1B", "Multicellular life"],
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


// Utilities
const toYears = (timeSince) => {
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
};

const toSeconds = years => (years / TOTAL_AGE) * SECONDS_IN_DAY;
const percentOfTimeSinceBirth = years => (years / TOTAL_AGE) * 100;

const randomColors = (total) =>
      [...Array(total).keys()]
      .map(x => `#${Math.floor(Math.random()*16777215).toString(16)}`);

// massage data
universeTimeline = universeTimeline
    .map(([timeSince, title]) => {
        const years = toYears(timeSince);
        const totalYears = toYears(universeTimeline[0][0]);
        return ({
            eventTitle: title,
            years: toYears(timeSince),
            seconds: toSeconds(years, totalYears),
            percent: percentOfTimeSinceBirth(years, totalYears)
        });
    });

earthTimeline = earthTimeline
    .map(([timeSince, title]) => {
        const years = toYears(timeSince);
        const totalYears = toYears(earthTimeline[0][0]);
        return ({
            eventTitle: title,
            years: toYears(timeSince),
            seconds: toSeconds(years, totalYears),
            percent: percentOfTimeSinceBirth(years, totalYears)
        });
    });

// D3 functions to visualise
// Bars
const drawBarForTimeline = (d3, timeline, divId, config) => {
    const totalYears = timeline[0].years;
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 70, left: 60},
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(`#${divId}`)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv").then(
        function(data) {

            // X axis
            const x = d3.scaleBand()
                  .range([0, width])
                  .domain(timeline.map(d => d.eventTitle))
                  .padding(0.2);

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            // Add Y axis
            const y = d3.scaleLinear()
                  .domain([0, Math.log(totalYears)])
                  .range([ height, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            // Bars
            svg.selectAll("mybar")
                .data(timeline)
                .join("rect")
                .attr("x", d => x(d.eventTitle))
                .attr("y", d => y(Math.log(d.years)))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(Math.log(d.years)))
                .attr("fill", "#69b3a2");

        });
};

// Pie
const drawPieForTimeline = (d3, timeline, divId, config) => {
    const {width, height, margin} = config;
    const totalYears = timeline[0].years;

    const radius = Math.min(width, height) / 2 - margin - 100;

    const donut_outer_radius = radius * 0.8;
    const donut_inner_radius = radius * 0.6;
    const outer_arc_radius = radius * 0.9;

    const svg = d3.select(`#${divId}`)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${(width/2) + 50},${(height/2) + 70})`);

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
          .value(d => d.seconds);

    const data_ready = pie(timeline);

    // The arc generator
    const arc = d3.arc()
          .innerRadius(donut_inner_radius)
          .outerRadius(donut_outer_radius);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('allSlices')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.seconds))
        .attr('stroke', 'white')
        .style('stroke-width', '0px')
        .style('opacity', 0.7);

    const bumpY = (prevY, currY) => {
        if (prevY == 0) { // first angle
            return currY;
        }

        const diff = Math.abs(Math.abs(prevY) - Math.abs(currY));
        console.log("y", currY, prevY);

        const bump = 12;
        if (diff < 10 || Math.abs(prevY) > Math.abs(currY)) {
            const a = (Math.max(Math.abs(prevY), Math.abs(currY)) + bump) * (currY < 0 ? -1 : 1);
            console.log("a", a);
            return a;
        }

        return currY;
    };
    // Add the polylines between chart and labels:

    const linePointsStore = new Array(timeline.length);
    svg
        .selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
        .attr('stroke', 'black')
        .style('fill', 'none')
        .attr('stroke-width', 1)
        .attr('points', function(d, index, prevLines) {
            const prevLinePoints = d.index > 0 ? linePointsStore[d.index - 1] : {a: [0,0], b: [0,0], c: [0,0]};

            let rad = donut_outer_radius;
            const posA = [Math.cos(d.endAngle - Math.PI*0.5) * rad, Math.sin(d.endAngle - Math.PI*0.5) * rad];
            const posB = [Math.cos(d.endAngle - Math.PI*0.5) * outer_arc_radius, bumpY(prevLinePoints.b[1], Math.sin(d.endAngle - Math.PI*0.5) * outer_arc_radius)];
            const posC = [Math.cos(d.endAngle - Math.PI*0.5) * outer_arc_radius, bumpY(prevLinePoints.c[1], Math.sin(d.endAngle - Math.PI*0.5) * outer_arc_radius)];

            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = outer_arc_radius * 0.95 * (midangle < Math.PI*0.5 ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left

            linePointsStore[d.index] = {a: posA, b: posB, c: posC};

            return [posA, posB, posC];
        });

    // Add the polylines between chart and labels:
    svg
        .selectAll('allLabels')
        .data(data_ready)
        .join('text')
        .text(d => d.data.eventTitle)
        .attr('transform', function(d) {
            //            const pos = [Math.cos(d.endAngle - Math.PI*0.5) * outer_arc_radius, Math.sin(d.endAngle - Math.PI*0.5) * outer_arc_radius];
            const pos = [Math.cos(d.endAngle - Math.PI*0.5) * outer_arc_radius, linePointsStore[d.index].b[1]];
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = outer_arc_radius * 0.99 * (midangle < Math.PI*0.5 ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midangle < Math.PI ? 'start' : 'end');
        });
};
