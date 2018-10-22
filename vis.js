import d3 from './d3'
import * as topojson from 'topojson-client'

// Inspiration:
// Dorling carto: https://bl.ocks.org/veltman/938ea2d0ef98c02633bec15d6fb3a177
// Municipalities of MX: https://bl.ocks.org/mbostock/c4c27dc3724e1ad3d680a581079b2e9c

var width = 960,
    height = 650;

var projection = d3.geoAlbersUsa()
var path = d3.geoPath(projection)

let nodes = null;
const svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height);

// This file name is a hack to get around the fact that
// parcel bundles JSON files, rather than treating them as static
// assets.
// See https://github.com/parcel-bundler/parcel/issues/501
const first = new Promise((res, rej) => {
  d3.json(require("./us.jsonx"), (error, topo) => {
    if (error) {
      console.error(error)
    }
    let states = topojson.feature(topo, topo.objects.states)
  
  	svg.selectAll("path")
        .data(states.features).enter()
        .append("path")
        .attr("class", "feature")
        .style("fill", "steelblue")
        .attr("d", path);
  
    svg.append("path")
      .datum(topojson.mesh(topo, topo.objects.states, (a, b) => { return a !== b }))
      .attr("class", "mesh")
      .attr("d", path);
  
    d3.csv(require('./input.csv'))
      .row((d) => {
        return {
          msa: d.msa,
          pt: [+d.lng, +d.lat],
          x: +d.lng,
          y: +d.lat,
          area: +d.area,
          year: +d.year.substring(0, 4),
          pct: +d.pct_of_total
        }}).get((err, rows) => {
          injectData(rows, d => d.year === 2001, 10)
          res(rows)
        })
  })
})
// d => Math.sqrt(Math.round(d['pct'] * 10000))
const second = (year, data) => {
  console.table(data.slice(0, 10))
  injectData(data.filter(x => x.year == year))
}

var t = d3.transition()
    .duration(100)
    .ease(d3.easeLinear);

const injectData = (data, filterFunc, radiusFunc) => {
  // add circles to svg
  nodes = svg.selectAll("circle")
	.data(data).enter()
  .filter(filterFunc)
	.append("circle")
  .attr("cx", d => { return projection(d.pt)[0] })
  .attr("cy", d => { return projection(d.pt)[1] })
  .attr("r", radiusFunc)
	.attr("fill", "crimson");

}

// main
Promise.resolve(first).then(
  data => second(2001, data)
)
// var simulation = d3.forceSimulation(nodes.nodes())
