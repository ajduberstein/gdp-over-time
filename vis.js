import d3 from './d3'
import * as topojson from 'topojson-client'

// Inspiration:
// Dorling carto: https://bl.ocks.org/veltman/938ea2d0ef98c02633bec15d6fb3a177
// Municipalities of MX: https://bl.ocks.org/mbostock/c4c27dc3724e1ad3d680a581079b2e9c

var width = 960,
    height = 650;

var projection = d3.geoAlbersUsa()
var path = d3.geoPath(projection)

var msaData;
var displayData;

const svg = d3.select("body").append("svg")
				.attr("width", width)
				.attr("height", height);

// const loadStates = (res, rej) => {
//   // This file name is a hack to get around the fact that
//   // parcel bundles JSON files, rather than treating them as static
//   // assets.
//   // See https://github.com/parcel-bundler/parcel/issues/501
//   d3.json(require("./us.jsonx"), (error, topo) => {
// 
//     if (error) {
//       console.error(error)
//       rej()
//     }
//     let states = topojson.feature(topo, topo.objects.states)
// 
//     svg.selectAll("path")
//         .data(states.features).enter()
//         .append("path")
//         .attr("class", "feature")
//         .style("fill", "steelblue")
//         .attr("d", path);
// 
//     svg.append("path")
//       .datum(topojson.mesh(topo, topo.objects.states, (a, b) => { return a !== b }))
//       .attr("class", "mesh")
//       .attr("d", path);
//     res() 
//   })
// }

const loadMsa = new Promise((res, rej) => {
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
        if (err) {
          console.error(err);
        }
        res(rows)
      });
})

const scale = pct => Math.sqrt(Math.round(pct * 10000))

const updateCircles = (data) => {
  if (!data) {
    console.error("Data not initialized")
  }
  const locations = svg.selectAll("circle").data(data);
  locations.enter().append("circle").attr("cx", d => projection(d.pt)[0] )
    .attr("cy", d => projection(d.pt)[1] )
	  .attr("fill", "crimson");
}

var t = d3.transition()
    .duration(100)
    .ease(d3.easeLinear);

let year = 2001
const tick = () => {
  year = year < 2018 ? ++year : 2002;
  const yearData = msaData.filter(d => d.year === year);
  updateCircles(yearData);
  console.log(year);
}

// main
loadMsa.then(
  (data) => {
    // Turn MSA map into force layout
    // Size elements by pct of GDP
    msaData = data
    let clock = setInterval(tick, 1000);
})
