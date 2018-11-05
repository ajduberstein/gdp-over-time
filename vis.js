import d3 from './d3';
import { getMousePosition, roundToNearest } from './utils';
import * as topojson from 'topojson-client'

let projection = d3.geoAlbersUsa(),
    path = d3.geoPath(projection);

let data;
let year = 2003;

// Beat average/median US growth rate by % // Beat median US growth rate by %
// GDP per capita
// GDP as % of US total
const header = d3.select('body').append('h1');
const svg = d3.select('div#vis')
  .append('svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 900 500')
  .classed('svg-content', true);

const loadStates = () => {
  return new Promise((res, rej) => {
    // See https://github.com/parcel-bundler/parcel/issues/501
    d3.json(require('./us.jsonx'), (error, topo) => {

      if (error) {
        console.error(error)
        rej()
      }
      let states = topojson.feature(topo, topo.objects.states)

      svg.selectAll('path')
          .data(states.features).enter()
          .append('path')
          .attr('class', 'feature')
          .style('fill', 'grey')
          .attr('d', path);

      svg.append('path')
        .datum(topojson.mesh(topo, topo.objects.states, (a, b) => { return a !== b }))
        .attr('class', 'mesh')
        .attr('d', path);
      res() 
    })
  })
}

const loadMsa = () => {
  return new Promise((res, rej) => {
    d3.csv(require('./input.csv'))
      .row((d) => {
        return {
          msa: d.msa,
          pt: [+d.lng, +d.lat],
          x: +d.lng,
          y: +d.lat,
          area: +d.area,
          year: +d.year.substring(0, 4),
          pct: +d.pct_change
        }})
      .get((err, rows) => {
          if (err) {
            console.error(err);
          }
          res(rows)
        });
  });
}

const scale = pct => Math.max(Math.abs(pct*10), 2)

let t = d3.transition()
  .duration(100)
  .ease(d3.easeLinear);

const tooltipFunc = (d) => {
  const [x, y] = getMousePosition()
  tooltip.transition()
    .duration(200)
    .style('opacity', .9)
    .style('left', `${roundToNearest(x, 15)}px`)
    .style('top', `${roundToNearest(y, 15)}px`)
  console.table(d);
  tooltip.html(d.msa);
}

const hideTipFunc = (d) => {
  tooltip.style('opacity', 0);
}

const tick = () => {
  svg.selectAll('circle').remove();
  let circles = svg
    .selectAll('circle')
    .data(data.filter(x => x['year'] === year));
  circles.enter().append('circle')
    .attr('cx', d => projection(d.pt)[0])
    .attr('cy', d => projection(d.pt)[1])
    .style('fill', d => d.pct > 0 ? 'steelblue' : 'crimson')
    .attr('r', d => scale(d.pct))
    .on('click', tooltipFunc)
    .on('mouseover', tooltipFunc)
    .on('mouseout', hideTipFunc)
  header.text(year);
  year = year < 2017 ? year + 1 : 2003;
}

var tooltip = d3.select('body').append('div')	
    .attr('class', 'tooltip')				
    .style('opacity', 0);

loadStates().then(loadMsa)
  .then((res) => data = res)
  .then(() => setInterval(tick, 1*250));
