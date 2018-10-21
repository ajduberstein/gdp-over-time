import d3 from './d3'
import * as topojson from 'topojson-client'

// Inspiration:
// Dorling carto: https://bl.ocks.org/veltman/938ea2d0ef98c02633bec15d6fb3a177
// Municipalities of MX: https://bl.ocks.org/mbostock/c4c27dc3724e1ad3d680a581079b2e9c

var width = 960,
    height = 650;

var projection = d3.geoAlbersUsa()
var path = d3.geoPath(projection)

const svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height);

// This file name is a hack to get around the fact that
// parcel bundles JSON files, rather than treating them as static
// assets.
// See https://github.com/parcel-bundler/parcel/issues/501
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
        area: +d.area,
        year: new Date(d.year),
        pct: +d.pct_of_total
      }}).get((err, rows) => {
        injectData(rows)
      })
})

const injectData = (data) => {
  // add circles to svg
  svg.selectAll("circle")
	.data(data).enter()
	.append("circle")
  .attr("cx", d => { return projection(d.pt)[0] })
  .attr("cy", d => { return projection(d.pt)[1] })
	.attr("r", "3px")
	.attr("fill", "red")
}
