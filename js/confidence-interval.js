function createCI(data, id, xKey, yKey) {
  let element = d3.select('#' + id).node();

  let margin = { top: 60, right: 60, bottom: 70, left: 30 },
    width = element.getBoundingClientRect().width - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  d3.select(`#${id} svg`).remove();

  let svg = d3.select("#" + id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  let mean = d3.mean(data);
  let median = d3.median(data);
  let dev = d3.deviation(data);

  let confidenceInterval = 95;
  let z = 1.960;

  let marginOfError = z * dev / Math.sqrt(data.length);

  let intervalMin = (mean - marginOfError).toFixed(2);
  let intervalMax = (mean + marginOfError).toFixed(2);

  let confidenceIntervalMessage = `With ${confidenceInterval}% confidence the population mean is between ${intervalMin} and ${intervalMax}`;

  $('#c11 p').html(`<span>Mean: ${numberWithCommas(mean.toFixed(2))}<span> 
    <span>Std Dev: ${numberWithCommas(dev.toFixed(2))}<span> 
    <br />${confidenceIntervalMessage}`);

  console.log('mean: ' + mean, 'median: ' + median, 'sample standard deviation: ' + dev, data)

  let binCount = 10;

  let [min, max] = d3.extent(data);

  let x = d3.scaleLinear()
    // .domain([min, 10000])
    .domain([0, max])
    .nice()
    .range([0, width]);

  let y = d3.scaleLinear()
    .range([height, 0]);

  let histogram = d3.histogram()
    .value(function (d) { return d; })
    .domain(x.domain())
    .thresholds(x.ticks(binCount));

  let bins = histogram(data);

  y.domain([0, d3.max(bins, function (d) { return d.length; })])

  // add the y Axis
  // svg.append("g")
  //   .call(d3.axisLeft(y).tickSize(-(width)));

  let bar = svg.selectAll('.bar-group')
    .data(bins)
    .enter()
    .append('g')
    .attr('class', 'bar-group');

  bar.append("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", function (d) { return x(d.x1) - x(d.x0); })
    .attr("height", function (d) { return height - y(d.length); });

  bar.append('text')
    .text((d, i) => i === (bins.length - 1) ? '' : d.length)
    .attr("x", d => ((x(d.x0) + x(d.x1)) / 2))
    .attr("y", d => y(d.length) - 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', 10);

  svg.append('line')
    .attr('x1', x(mean))
    .attr('y1', 0 - (margin.top / 2))
    .attr('x2', x(mean))
    .attr('y2', height)
    .attr('stroke', 'orange')
    .attr('stroke-dasharray', 2)
    .attr('stroke-width', 2);


  // add the x Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(numFormat));

  svg.append("text")
    .attr("y", height + 25)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-size', 10)
    .text(`${yKey} / ${xKey}`);
};