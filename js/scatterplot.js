function scatterPlot(data, id, xKey, yKey) {
  data = [...data].sort((a, b) => a[xKey] - b[xKey]);

  let element = d3.select('#' + id).node();

  let margin = { top: 30, right: 50, bottom: 50, left: 50 },
    width = element.getBoundingClientRect().width - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  d3.select(`#${id} svg`).remove();

  let svg = d3.select("#" + id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  let div = d3.select("#" + id).append("div")
    .attr("class", id + "-tooltip")
    .style("opacity", 0);

  let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d[xKey]))
    .range([0, width]);

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[yKey])])
    .range([height, 0]);

  let min = d3.min(data, d => d[xKey]);
  console.log('min: ' + min)


  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(numFormat).tickSize(-(width)));

  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", d => x(d[xKey]))
    .attr("cy", d => y(d[yKey]))
    .on("mouseover", function (d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d[xKey] + "<br/>" + numFormat(d[yKey]) + "<br/>" + d.name)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  let xSeries = data.map(d => d[xKey]);
  let ySeries = data.map(d => d[yKey]);

  let leastSquaresCoeff = leastSquares(xSeries, ySeries);

  console.log('slope', leastSquaresCoeff[0]);
  console.log('intercept', leastSquaresCoeff[1]);
  console.log('rSquare', leastSquaresCoeff[2]);

  let x1 = data[0][xKey];
  let y1 = (leastSquaresCoeff[0] * x1) + leastSquaresCoeff[1];
  let x2 = data[data.length - 1][xKey];
  let y2 = (leastSquaresCoeff[0] * x2) + leastSquaresCoeff[1];

  // Change R2 here!
  $('#c3 p').html('R<sup>2</sup>: ' + leastSquaresCoeff[2].toFixed(2));

  svg.append("line")
    .attr("class", "trendline")
    .attr("x1", x(x1))
    .attr("y1", y(y1))
    .attr("x2", x(x2))
    .attr("y2", y(y2))
    .attr("stroke-width", 1);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(numFormat));

  svg.append("text")
    .attr("y", height + 25)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-size', 10)
    .text(xKey);

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-size', 10)
    .text(yKey);
}

// returns slope, intercept and r-square of the line
function leastSquares(xSeries, ySeries) {
  var reduceSumFunc = function (prev, cur) { return prev + cur; };

  var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
  var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

  var ssXX = xSeries.map(function (d) { return Math.pow(d - xBar, 2); })
    .reduce(reduceSumFunc);

  var ssYY = ySeries.map(function (d) { return Math.pow(d - yBar, 2); })
    .reduce(reduceSumFunc);

  var ssXY = xSeries.map(function (d, i) { return (d - xBar) * (ySeries[i] - yBar); })
    .reduce(reduceSumFunc);

  var slope = ssXY / ssXX;
  var intercept = yBar - (xBar * slope);
  var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

  return [slope, intercept, rSquare];
}