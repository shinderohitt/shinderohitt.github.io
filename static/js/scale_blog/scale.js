// constants and data to render; some manage configs
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
    ["6M", "Grandmother with monkeys"],
    ["2.2M", "Genus homo"],
    ["0.195M", "Modern humans"],
    ["0.1M", "Out of africa"],
    ["0.038M", "First domesticated dogs"],
    ["0.006M", "Civilisation begins"]
];

let sapiensTimeline = [
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
    ["6M", "Shared grandmother with monkeys"],
    ["2.2M", "Genus homo"],
    ["0.3M", "Homo sapiens"]
];

let earthTimeline = [
    ["2.2M", "Genus homo"],
    ["0.195M", "Anatomically modern humans"],
    ["0.1M", "Out of africa"],
    ["0.038M", "First domesticated dogs"],
    ["0.006M", "Civilisation begins"],
    ["45", "Personal computer"],
    ["13", "iPhone"]
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

    return `${days/365} years`;
};

const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;
const randomColors = (total) =>
      [...Array(total).keys()]
      .map(x => randomColor());

const timeSinceMidnight = (years, totalYears) => {
    const seconds = Math.round(((totalYears - years) / totalYears) * SECONDS_IN_DAY);
    return moment('1970-01-01').add(seconds, 's').format('hh:mm:ss a');
};

const darkColors = [
    '#FFADAD',
    '#FFD6A5',
    '#FDFFB6',
    '#CAFFBF',
    '#9BF6FF',
    '#A0C4FF',
    '#BDB2FF',
    '#FFC6FF',
    '#FFD6A5',
    '#FDFFB6',
    '#CAFFBF',
    '#9BF6FF'
];

const lightColors = [
    '#CDF5FF',
    '#ECECEC',
    '#FFF1E6',
    '#FDE2E4',
    '#FAD2E1',
    '#FFE6F8',
    '#BEE1E6',
    '#F0EFEB',
    '#DFE7FD',
    '#CDDAFD',
    '#F2D2FC',
    '#FCD7E5',
    '#FF9E9E'
];

const updateTimelineWithUsefulNumbers = (timeline, colors) => {
    const totalYears = toYears(timeline[0][0]);
    const mostRecentEventYears = toYears(timeline[timeline.length-1][0]);
    let midnight = moment().hours(0).minutes(0).seconds(0).millisecond(0);
    let today = moment();


    const now = moment();
    return timeline
        .map(([timeSince, title], idx) => {
            const years = toYears(timeSince);
            const seconds = toSeconds(years, totalYears);
            const yearsInDaysScale = yearsInTermsOfDays(years, mostRecentEventYears);
            const days = Math.round(years / mostRecentEventYears);

            const hundredYearScaleSeconds = Math.round(years / 100);
            return ({
                eventTitle: title,
                years: years,
                color: colors[idx],
                seconds: seconds,
                timeSinceMidnight: timeSinceMidnight(years, totalYears),
                yearsInDaysScale: yearsInDaysScale,
                fromNow: moment().add(days, 'day').fromNow(),
                hundredYearScaleSeconds: now.from(moment().add(hundredYearScaleSeconds, 's')),
            });
        });
};

// massage data
universeTimeline = updateTimelineWithUsefulNumbers(universeTimeline, darkColors);
earthTimeline = updateTimelineWithUsefulNumbers(earthTimeline, darkColors);
sapiensTimeline = updateTimelineWithUsefulNumbers(sapiensTimeline, lightColors);

const updateTables = (timeline, tbody) => {
    let rows = '';
    timeline.forEach(t => {
        const time = readableTimeFromSeconds(t.seconds);
        rows += `<tr>
                   <td>${t.eventTitle}</td>
                   <td>${t.timeSinceMidnight}</td>
                   <td>${t.fromNow}</td>
                   <td>${t.hundredYearScaleSeconds}</td>
                 </tr>`;
    });
    tbody.innerHTML = rows;
};

const updateGridVisualisationTable = (timeline, tbody) => {
    let rows = '';
    timeline.forEach(t => {
        const time = readableTimeFromSeconds(t.seconds);
        rows += `<tr>
                   <td>${t.eventTitle}</td>
                   <td>${t.years}</td>
                   <td style="background-color: ${t.color}">
                   </td>
                 </tr>`;
    });
    tbody.innerHTML = rows;
};

const drawGridVisualisationHorizontal = (canvasEl, timeline, yearsBlock) => {
    // massage the timeline so that, the previous event's years are inclusive of the next
    let tl = timeline.slice(0);
    tl = tl.map((t, idx) => {
        // For each item's years: deduct the sum of all years of all previous events
        if (idx < tl.length - 1) {
            const nxt = idx + 1;
            t.years = t.years - tl[nxt].years;
        }
        return t;
    });

    tl = tl.reverse();
    const canvas = new fabric.StaticCanvas(canvasEl);
    const totalRows = 100;
    const rectSize = 5;
    const totalYears = tl[0].years;

    const blocksPerRow = totalRows / 5;
    const totalColumns = Math.round((tl.reduce((acc, {years}) => acc + Math.round(years / yearsBlock), 0)) / blocksPerRow);

    const rectsPerColumn = (totalRows/rectSize);

    const width = totalColumns * rectSize;

    canvas.setHeight(totalRows * rectSize);
    canvas.setWidth(width);


    let left = 0;
    let top = 0;
    let prevTop = 0;

    for (var i=0; i<tl.length; i++) {
        let color = tl[i].color;

        const rects = Math.round(tl[i].years / yearsBlock);

        for (var j=0; j<rects; j++) {
            top = (top + rectSize) % totalRows;
            if (top == 0) {
                // we are to jump to the next line. now add a rect from prevTop till end
                const height = top == 0 ? totalRows * rectSize : top - prevTop;
                const rect = new fabric.Rect({
                    left: left,
                    top: prevTop,
                    fill: color,
                    width: rectSize,
                    height: height
                });
                canvas.add(rect);
                prevTop = top;
                left = left + rectSize;
            }

            // in terms of next lines, check if columns can be clubbed together to reduce the number of rects to be drawn
            const remainingRects = rects - j;
            const maxColumns = Math.floor(remainingRects / rectsPerColumn);
            if (maxColumns > 0 && (top == 0 || (top-rectSize == 0))) {
                const rect = new fabric.Rect({
                    left: left,
                    top: 0,
                    fill: color,
                    width: maxColumns * rectSize,
                    height: totalRows * rectSize
                });
                canvas.add(rect);
                left = left + (maxColumns * rectSize);
                top = prevTop = 0;
                j += (maxColumns * (totalRows/rectSize));
            }
        }

        if (top != 0) {
            const rect = new fabric.Rect({
                left: left,
                top: prevTop,
                fill: color,
                width: rectSize,
                height: top - prevTop
            });
            prevTop = top;
            canvas.add(rect);
        }
    }
    canvas.renderAll();
};

const readableNumber = (number) => {
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;

    if (number < 1000) {
        return `${number}`;
    }

    if (number < 1000000) {
        return `${(number / thousand)} thousand`;
    }

    if (number < 1000000000) {
        return `${(number / million)} million`;
    }

    return `${(number / billion)} billion`;
};

const drawGridVisualisation = (canvasEl, {width, timeline, yearsBlock}) => {
    let tl = timeline.slice(0);

    tl = tl.reverse();
    const canvas = new fabric.StaticCanvas(canvasEl);

    const totalRows = 100;
    const rectSize = 7;

    const totalYears = tl.map(t => t.years).reduce((acc, years) => acc+years);

    const columnsPerRow = Math.floor(width / rectSize);
    const totalRects = Math.round(totalYears / yearsBlock);
    const totalRowsNeeded = totalRects / columnsPerRow;
    const totalHeight = totalRowsNeeded * rectSize;
    const totalWidth = columnsPerRow * rectSize;

    canvas.setHeight(totalHeight);
    canvas.setWidth(width);

    let top = 0;
    for (let i=0; i<tl.length; i++) {
        const event = tl[i];
        const color = event.color;

        const rects = Math.round(tl[i].years / yearsBlock);
        const rowsToPaint = Math.ceil(rects / columnsPerRow);
        const heightForEvent = rowsToPaint * rectSize;
        const widthForEvent = rects > columnsPerRow ? totalWidth : rects * rectSize;

        const rect = new fabric.Rect({
            left: 0,
            top: top,
            fill: color,
            width: widthForEvent,
            height: heightForEvent
        });

        const startTextAtX = widthForEvent == totalWidth ? totalWidth / 2 : widthForEvent + rectSize;
        const startTextAtY = heightForEvent > rectSize ? top + Math.floor(heightForEvent / 2) : top;
        const text = new fabric.Text(
            `${event.eventTitle} - ${readableNumber(event.years)}`,
            {
                left: startTextAtX,
                top: startTextAtY,
                fontSize: 7,
                fontFamily: 'Delicious',
                color: '#7d3d3d'
            });

        canvas.add(rect);
        canvas.add(text);

        top = top + heightForEvent;
    }
    canvas.renderAll();
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
};

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
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", config.viewbox)
          // .attr("width", width)
          // .attr("height", height)
          .append("g")
          .attr("transform", config.translate);

    timeline.forEach(({seconds}) => readableTimeFromSeconds(seconds));

    // set the color scale
    const color = d3.scaleOrdinal()
          .domain(timeline.map(t => t.seconds))
          .range(timeline.map(t => t.color));

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
            const pos = [Math.cos(d.endAngle - Math.PI*0.5) * outer_arc_radius, linePointsStore[d.index].b[1]];

            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;

            pos[0] = outer_arc_radius * 0.99 * (midangle < Math.PI*0.5 ? 1 : -1);

            // hack. regret this. but don't want to waste too much time trying to make this generic.
            if (d.data.eventTitle=='Anatomically modern humans') {
                pos[0] = outer_arc_radius * 2.35 * (midangle < Math.PI*0.5 ? 1 : -1);
            }

            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midangle < Math.PI ? 'start' : 'end');
        });
};

