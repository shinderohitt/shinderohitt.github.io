// constants and data to render; some manage configs
//const TOTAL_AGE = 13600000000.0;
const TOTAL_AGE = 380000000.0;
const AGE_SINCE_EARTH = 4500000000.0;
const SECONDS_IN_DAY = 24 * 60 * 60;

const pie_width = 500,
      pie_height = 500,
      pie_margin = 1;

let universeTimeline = [
    ["13.6B", "Universe's birth"],
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
    ["0.038M", "First domesticated dogs"],
    ["0.006M", "Civilisation begins"]
];

let earthTimeline = [
    // ["4.5B", "Earth's birth"],
    // ["4B", "First life"],
    // ["2.1B", "Multicellular life"],
    // ["380M", "Trees"],
    // ["225M", "First mammals"],
    // ["60M", "First primates"],
    // ["55M", "First modern birds"],
    // ["18M", "Great apes and lesser apes diverge"],
    // ["6M", "Last common ancestor humans and chimpanzees"],
    ["2.2M", "Genus homo"],
    ["0.195M", "Anatomically modern humans"],
    ["0.1M", "Out of africa"],
    ["0.038M", "First domesticated dogs"],
    ["0.006M", "Civilisation begins"]
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

const toSeconds = (years, totalYears) =>
      Math.round((years / totalYears) * SECONDS_IN_DAY);

const percentOfTimeSinceBirth = (years, totalYears) => (years / totalYears) * 100;

const yearsInTermsOfDays = (years, mostRecentEventYears) => {
    const days = years / mostRecentEventYears;
    if (days < 30) {
        return `${days} days`;
    }

    if (days < 365) {
        return `${days/30} months`;
    }

    return `${days/365} years`
};

const randomColors = (total) =>
      [...Array(total).keys()]
      .map(x => `#${Math.floor(Math.random()*16777215).toString(16)}`);

const timeSinceMidnight = (years, totalYears) => {
    const seconds = Math.round(((totalYears - years) / totalYears) * SECONDS_IN_DAY);
    console.log(seconds);
    return moment('1970-01-01').add(seconds, 's').format('hh:mm:ss a');
};

const updateTimelineWithUsefulNumbers = (timeline) => {
    const totalYears = toYears(timeline[0][0]);
    const mostRecentEventYears = toYears(timeline[timeline.length-1][0]);
    let midnight = moment().hours(0).minutes(0).seconds(0).millisecond(0);
    let today = moment();

    console.log('totalyears', totalYears);
    return timeline
        .map(([timeSince, title], idx) => {
            const years = toYears(timeSince);
            const seconds = toSeconds(years, totalYears);
            const yearsInDaysScale = yearsInTermsOfDays(years, mostRecentEventYears);
            const days = Math.round(years / mostRecentEventYears);

            return ({
                eventTitle: title,
                years: years,
                seconds: seconds,
                timeSinceMidnight: timeSinceMidnight(years, totalYears),
                yearsInDaysScale: yearsInDaysScale,
                fromNow: moment().add(days, 'day').fromNow(),
            });
        });
};

// massage data
universeTimeline = updateTimelineWithUsefulNumbers(universeTimeline);
earthTimeline = updateTimelineWithUsefulNumbers(earthTimeline);

const updateTables = (timeline, tbody) => {
    let rows = '';
    timeline.forEach(t => {
        const time = readableTimeFromSeconds(t.seconds);
        rows += `<tr>
                   <td>${t.eventTitle}</td>
                   <td>${t.timeSinceMidnight}</td>
                   <td>${t.fromNow}</td>
                 </tr>`;
    })
    tbody.innerHTML = rows;
};

const readableTimeFromSeconds = (seconds) => {
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

    return time;
}

// D3 functions to visualise
// Pie
const drawPieForTimeline = (d3, timeline, divId, config) => {
    const {width, height, margin} = config;
    const totalYears = timeline[0].years;
    timeline = timeline.slice(1);

    const radius = Math.min(width, height) / 2 - margin - 100;

    const donut_outer_radius = radius * 0.8;
    const donut_inner_radius = radius * 0.6;
    const outer_arc_radius = radius * 0.9;

    const svg = d3.select(`#${divId}`)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${(width/2)},${(height/2) + 30})`);

    timeline.forEach(({seconds}) => readableTimeFromSeconds(seconds));

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

        const bump = 12;
        if (diff < 10 || Math.abs(prevY) > Math.abs(currY)) {
            const a = (Math.max(Math.abs(prevY), Math.abs(currY)) + bump) * (currY < 0 ? -1 : 1);
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

const drawUniverseGrid = (canvasId) => {
    const canvas = document.getElementById(`#${canvasId}`);
}
