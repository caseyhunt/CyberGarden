// import * as d3 from "d3";


const interval = d3.utcMinute.every(10);
const stop = interval();
const start = interval.offset(stop, -928);
const signups = wave({
  min: 0,
  max: 200,
  period: 120,
  round: true
});

document.getElementById('temp-canvas')
  .addEventListener('click', function(event) {
    createTempGraphs();
  });


const createTempGraphs = () => {
  const divID = ['humidity-canvas', 'air-canvas'];
  for (const element of divID) {
    d3.select(`#${element}`).transition().duration(100).ease(d3.easeLinear).attr("class", "hidden");
  }
  d3.select('#temp-detailed').attr("class", "detailed animation active ");
  d3.select('#temp-ts').attr("class", "time-series animation active");
  d3.select("#iframe1").attr("class", "active");

  // let iframe1 = document.getElementById("iframe1");
  // let iframeElementy = (iframe1.contentWindow || iframe1.contentDocument);
  // let iframeElementz = iframeElementy.document.body;
  //
  // d3.select(iframeElementz).style("border", "none");

  // iframe.style("border-style", "none");


  // frame1.$('mydiv').style.border = '1px solid #000000'
  // createTimeSeries(signups);
}




const createTimeSeries = (data) => {
  const width = document.getElementById("temp-ts").offsetWidth;
  const height = document.getElementById("temp-ts").offsetHeight;
  const marginTop = 16;
  const max = 100;
  const bands = 4;
  const curve = maybeCurve(d3.curveStepBefore);
  const scheme = maybeScheme(d3.schemeRdGy);
  const x = d3.scaleUtc([start, stop], [0, width]);
  const y = d3.scaleLinear([0, max], [0, -bands * height]);
  const mode = "offset";
  const title = "Blues";
  // const clip = DOM.uid("clip");
  // const path = DOM.uid("path");

  const values = new Map(data.map(d => [+d.date, +d.value]));
  const [ymin, ymax] = d3.extent(values, ([, value]) => value);

  // Normalize the color scheme
  let colors;
  if (scheme.length < 11) { // assume sequential, pad with greys
    colors = scheme[Math.max(3, bands)];
    if (bands < 3) colors = colors.slice(3 - bands).concat(new Array(3 - bands));
    colors = [...d3.reverse(d3.schemeGreys[colors.length]), undefined, ...colors];
  } else { // otherwise assume diverging
    colors = scheme[Math.max(3, 2 * bands + 1)];
  }

  const svg = d3.select("#temp-ts").append("svg")
    // .attr("viewBox", `0 ${-marginTop} ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .property("style", `
          display: block;
          font: 12px var(--sans-serif, system-ui, sans-serif);
          font-variant-numeric: tabular-nums;
          overflow: visible;
        `);


  const tooltip = svg.append("title");

  svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

  svg.append("defs").append("path")
    .attr("id", "path")
    .attr("d", d3.area()
      .curve(curve)
      .defined(d => !isNaN(d.value))
      .x(d => round(x(d.date)))
      .y0(0)
      .y1(d => round(y(d.value)))
      (signups));

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

}

function maybeCurve(curve) {
  if (curve == null) throw new Error("missing curve");
  if (typeof curve !== "function") {
    const c = d3[`curve${camelize(curve)}`];
    if (c === undefined) throw new Error(`unknown curve: ${curve}`);
    curve = c;
  }
  return curve;
}

function wave({
  min = 0,
  max = 1,
  shift = 0,
  period = 24 * 6, // matching the default 10-minute interval
  noise = 0.2,
  pow = 1,
  round = false
} = {}) {
  return interval.range(start, stop).map((date, i) => {
    const t = (Math.sin((i - shift) / period * 2 * Math.PI) + 1) / 2;
    const n = Math.random();
    let value = +min + (max - min) * (t ** pow * (1 - noise) + n * noise);
    if (round) value = Math.round(value);
    return {
      date,
      value
    };
  });
}

function round(x) {
  return Math.round(x * 2) / 2;
}

function maybeScheme(scheme) {
  if (scheme == null) throw new Error("missing scheme");
  if (!Array.isArray(scheme)) {
    const s = (scheme + "").toLowerCase();
    switch (s) {
      case "brbg":
        return d3.schemeBrBG;
      case "prgn":
        return d3.schemePRGn;
      case "piyg":
        return d3.schemePiYG;
      case "puor":
        return d3.schemePuOr;
      case "rdbu":
        return d3.schemeRdBu;
      case "rdgy":
        return d3.schemeRdGy;
      case "rdylbu":
        return d3.schemeRdYlBu;
      case "rdylgn":
        return d3.schemeRdYlGn;
      case "spectral":
        return d3.schemeSpectral;
      case "blues":
        return d3.schemeBlues;
      case "greens":
        return d3.schemeGreens;
      case "greys":
        return d3.schemeGreys;
      case "oranges":
        return d3.schemeOranges;
      case "purples":
        return d3.schemePurples;
      case "reds":
        return d3.schemeReds;
      case "bugn":
        return d3.schemeBuGn;
      case "bupu":
        return d3.schemeBuPu;
      case "gnbu":
        return d3.schemeGnBu;
      case "orrd":
        return d3.schemeOrRd;
      case "pubu":
        return d3.schemePuBu;
      case "pubugn":
        return d3.schemePuBuGn;
      case "purd":
        return d3.schemePuRd;
      case "rdpu":
        return d3.schemeRdPu;
      case "ylgn":
        return d3.schemeYlGn;
      case "ylgnbu":
        return d3.schemeYlGnBu;
      case "ylorbr":
        return d3.schemeYlOrBr;
      case "ylorrd":
        return d3.schemeYlOrRd;
    }
    throw new Error(`invalid scheme: ${scheme}`);
  }
  return scheme;
}
// console.log(signups);

// createTempGraphs();