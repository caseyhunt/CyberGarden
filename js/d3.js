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
  d3.select("#iframe2").attr("class", "active");
}