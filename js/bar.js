function createBar(data, id, type, minVal) {
  let element = d3.select('#' + id).node();

  let margin = { top: 30, right: 30, bottom: 85, left: 30 },
    width = element.getBoundingClientRect().width - margin.right - margin.left,
    height = 250 - margin.top - margin.bottom;

  let svg = d3.select('#' + id)
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.right + margin.left)
    .append('g')
    .attr('transform',
      `translate(${margin.left}, ${margin.top})`);


  let x = d3.scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, width])
    .padding(0.1);

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d[type])])
    .range([height, 0])
    .nice();

  let bar = svg.selectAll('.bar-group')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar-group');

  bar.append('rect')
    .attr('class', 'bar')
    .attr('data-name', d => d.name)
    .attr('x', (d) => x(d.name))
    .attr('y', (d) => y(d[type]))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d[type]))
    .style('fill', (d) => ((type && d[type] >= minVal)) ? '#EA2489' : 'orange');

  // bar.append('text')
  //   .text((d) => numFormat(d.subs))
  //   .attr('x', (d) => x(d.name) + (x.bandwidth() / 2))
  //   .attr('y', (d) => y(d.subs) - 5)
  //   .attr('text-anchor', 'middle')
  //   .style('font-family', 'sans-serif')
  //   .style('font-size', 10);

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('x', x.bandwidth() / 2)
    .attr('y', 0)
    .attr('dy', x.padding())
    .attr('transform', 'rotate(90)')
    .attr('text-anchor', 'start')
    .style('text-transform', 'capitalize');

  svg.append('g')
    .call(d3.axisLeft(y).tickFormat(numFormat));
}
