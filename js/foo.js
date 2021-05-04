const TimeChart = () => {
  let clientX = 928 + 14;

  function TimeChart(data, {
    interval,
    start,
    stop,
    max = d3.quantile(data, 0.99, d => Math.abs(d.value) || NaN) || 1,
    title,
    locale = "en-US",
    dateFormat = localeFormat(locale),
    format = localeFormat(locale),
    marginTop = 0, // try -16 to remove the gap between cells
    height = 49, // inclusive of margin
    width,
    bands = 4,
    onclick,
    curve = d3.curveStepBefore,
    scheme = d3.schemeRdGy,
    mode = "offset"
  } = {}) {
    const values = new Map(data.map(d => [+d.date, +d.value]));
    const [ymin, ymax] = d3.extent(values, ([, value]) => value);

    // Normalize string arguments
    if (typeof format === "string") format = d3.format(format);
    else if (typeof format !== "function") format = localeFormat(locale, format);
    if (typeof dateFormat === "string") dateFormat = d3.utcFormat(dateFormat);
    else if (typeof dateFormat !== "function") dateFormat = localeFormat(locale, dateFormat);
    interval = maybeInterval(interval);
    curve = maybeCurve(curve);
    scheme = maybeScheme(scheme);
    mode = maybeMode(mode);
    bands = Math.floor(bands);
    if (!(bands >= 1 && bands < scheme.length)) throw new Error(`invalid bands: ${bands}`);

    // Normalize the color scheme
    let colors;
    if (scheme.length < 11) { // assume sequential, pad with greys
      colors = scheme[Math.max(3, bands)];
      if (bands < 3) colors = colors.slice(3 - bands).concat(new Array(3 - bands));
      colors = [...d3.reverse(d3.schemeGreys[colors.length]), undefined, ...colors];
    } else { // otherwise assume diverging
      colors = scheme[Math.max(3, 2 * bands + 1)];
    }

    // Normalize the data to the given interval, filling in any missing data with zeroes.
    data = interval.range(start, stop).map(date => ({
      date,
      value: values.get(+date) || 0
    }));
    if (width === undefined) width = data.length;

    const x = d3.scaleUtc([start, stop], [0, width]);
    const y = d3.scaleLinear([0, max], [0, -bands * height]);
    const clip = DOM.uid("clip");
    const path = DOM.uid("path");

    const svg = d3.create("svg")
      .attr("viewBox", `0 ${-marginTop} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .property("style", `
          display: block;
          font: 12px var(--sans-serif, system-ui, sans-serif);
          font-variant-numeric: tabular-nums;
          margin: 0 0 ${+marginTop}px calc(100% - ${width}px);
          overflow: visible;
        `);

    const tooltip = svg.append("title");

    svg.append("clipPath")
      .attr("id", clip.id)
      .append("rect")
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);

    svg.append("defs").append("path")
      .attr("id", path.id)
      .attr("d", d3.area()
        .curve(curve)
        .defined(d => !isNaN(d.value))
        .x(d => round(x(d.date)))
        .y0(0)
        .y1(d => round(y(d.value)))
        (data));

    const g = svg.append("g")
      .attr("clip-path", clip);

    g.append("g")
      .selectAll("use")
      .data(d3.range(bands)
        .map(i => [i, colors[i + 1 + (colors.length >> 1)]])
        .filter(([i, color]) => color != null && ymax > max * i / bands))
      .join("use")
      .attr("fill", ([, color]) => color)
      .attr("transform", ([i]) => `translate(0,${(i + 1) * height})`)
      .attr("xlink:href", path.href);

    g.append("g")
      .selectAll("use")
      .data(d3.range(bands)
        .map(i => [i, colors[(colors.length >> 1) - 1 - i]])
        .filter(([i, color]) => color != null && -ymin > max * i / bands))
      .join("use")
      .attr("fill", ([, color]) => color)
      .attr("transform", mode === "mirror" ?
        ([i]) => `translate(0,${(i + 1) * height}) scale(1,-1)` :
        ([i]) => `translate(0,${-i * height})`)
      .attr("xlink:href", path.href);

    const overlay = svg.append("g");

    if (title != null) overlay.append("text")
      .attr("class", "title")
      .attr("font-weight", "bold")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("y", 2 * 16)
      .attr("dy", "0.32em")
      .text(title + "");

    overlay.append("text")
      .attr("class", "label")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("text-anchor", "end")
      .attr("y", height - 16 - 1)
      .attr("dx", -3)
      .attr("dy", "0.32em");

    overlay.selectAll("text")
      .select(function() {
        const clone = this.cloneNode(true);
        return this.parentNode.insertBefore(clone, this);
      })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4);

    overlay.append("line")
      .attr("class", "line")
      .attr("stroke", "white")
      .attr("stroke-dasharray", "1,1")
      .style("mix-blend-mode", "screen")
      .attr("y1", 0)
      .attr("y2", height);

    overlay.select("line").clone(true)
      .attr("stroke", "black")
      .attr("stroke-dashoffset", 1);

    const line = overlay.selectAll(".line");
    const label = overlay.selectAll(".label");
    const text = overlay.selectAll(".title");

    function invert(event) {
      const [mx] = d3.pointer(event, svg.node());
      const i = d3.bisector(d => d.date).left(data, x.invert(mx), 0, data.length - 1);
      return data[i];
    }

    function mousemoved(event) {
      clientX = event.clientX;
      const d = invert(event);
      label.attr("x", x(d.date)).text(format(d.value));
      line.attr("x1", x(d.date) - 0.5).attr("x2", x(d.date) - 0.5);
      tooltip.text(dateFormat(d.date));
    }

    function resized() {
      text.attr("x", Math.max(0, width - document.body.clientWidth) + 4);
    }

    resized();
    addEventListener("resize", resized);
    addEventListener("mousemove", mousemoved);
    requestAnimationFrame(() => mousemoved({
      clientX,
      clientY: 0
    }));

    disposal(svg.node()).then(() => {
      removeEventListener("resize", resized);
      removeEventListener("mousemove", mousemoved);
    });

    return Object.assign(svg.node(), {
      onclick,
      value: data,
      invert
    });
  }

  TimeChart.defaults = defaults => {
    return (data, options) => {
      return TimeChart(data, {
        ...defaults,
        ...options
      });
    };
  };

  return TimeChart;
}

let interval = d3.utcMinute.every(10)
let stop = interval();
let start = interval.offset(stop, -928) // inclusive



timeChart = TimeChart.defaults({
  interval,
  start,
  stop,
  scheme: "purples"
})