function boxplot(data, key, id, xKey, yKey) {
  let element = d3.select('#' + id).node();

  const margin = { top: 30, right: 30, bottom: 40, left: 40 },
    width = element.getBoundingClientRect().width - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const boxCenter = height / 2;
  const boxHeight = 100;

  d3.select(`#${id} svg`).remove();

  let svg = d3.select('#' + id)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')');

  data = data.map(d => d[key]);
  data.sort(d3.ascending);

  let [min, max] = d3.extent(data);
  let q1 = d3.quantile(data, .25);
  let median = d3.quantile(data, .5);
  let q3 = d3.quantile(data, .75);
  let interQuantileRange = q3 - q1;
  min = Math.max(min, q1 - interQuantileRange * 1.5);
  max = Math.min(max, q3 + interQuantileRange * 1.5);

  $('#c4 p').html(`<span>Q1: ${numberWithCommas(q1)}</span> 
    <span>Median: ${numberWithCommas(median)}</span> 
    <span>Q3: ${numberWithCommas(q3)}</span>`);

  let x = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, width]);

  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).tickFormat(numFormat).tickSize(-height));

  // Show the main horizontal line
  svg
    .append('line')
    .attr('y1', boxCenter)
    .attr('y2', boxCenter)
    .attr('x1', x(min))
    .attr('x2', x(max))
    .attr('stroke', '#222')

  // Show the box
  svg
    .append('rect')
    .attr('x', x(q1))
    .attr('y', boxCenter - boxHeight / 2)
    .attr('width', (x(q3) - x(q1)))
    .attr('height', boxHeight)
    .attr('stroke', '#222')
    .style('fill', '#EA2489')

  // show median, min and max horizontal lines
  svg
    .selectAll('toto')
    .data([min, median, max])
    .enter()
    .append('line')
    .attr('class', 'vertical-line')
    .attr('y1', boxCenter - boxHeight / 2)
    .attr('y2', boxCenter + boxHeight / 2)
    .attr('x1', function (d) { return (x(d)) })
    .attr('x2', function (d) { return (x(d)) })
    .attr('stroke', '#222');

  svg.append("text")
    .attr("y", height + 25)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-size', 10)
    .text(`${yKey} / ${xKey}`);
}