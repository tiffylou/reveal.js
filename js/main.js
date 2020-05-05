let numFormat = d3.format(".2s");
let data;

d3.csv('js/influencers.csv', (d) => {

  d.uploads = +d.uploads;
  d.subs = +d.subs;
  d.views = +d.views;
  d.dailyViews = +d.dailyViews;
  d.weeklyViews = +d.weeklyViews;
  d.lastMonthlyViews = +d.lastMonthlyViews;
  d.viewsPerUpload = +d.viewsPerUpload;
  d.viewsPerSubs = +d.viewsPerSubs;
  d.viewsPerDays = +d.viewsPerDays;
  d.subsPerUpload = +d.subsPerUpload;
  d.daysPerUpload = +d.daysPerUpload;
  d.subs2019 = +d.subs2019;
  d.days = +d.days;

  return d;

}).then((results) => {
  data = results;
  data.sort((a, b) => a.subs - b.subs);



  data.sort((a, b) => b.subs - a.subs);

  console.log(data)

  let firstGroup = data.filter(d => d.subs >= 2700000);
  let secondGroup = data.filter(d => d.subs < 2700000 && d.subs >= 697000);
  let thirdGroup = data.filter(d => d.subs < 697000 && d.subs >= 300000);
  let fourthGroup = data.filter(d => d.subs < 300000);

  makeRows(firstGroup, '#tb-1', data);
  makeRows(secondGroup, '#tb-2', data);
  makeRows(thirdGroup, '#tb-3', data);
  makeRows(fourthGroup, '#tb-4', data);


  settingsChanged();
});

function drawCharts(key, xKey, yKey) {
  let chartData = data;

  if ($('#trim-data')[0].checked) {
    let trimAmount = 0.20;
    let trim = Math.round(trimAmount * data.length);
    chartData = data.slice(trim, data.length - trim);
  }

  let viewsPerSubsArr = chartData.map(d => d[key]);

  createHistogram(viewsPerSubsArr, 'c1', xKey, yKey);

  scatterPlot(chartData, 'c3', xKey, yKey);

  // createBar(chartData, 'c0');

  boxplot(chartData, key, 'c4', xKey, yKey);
}

function settingsChanged() {
  let value = $('input[name="views-toggle"]:checked')[0].value;

  if (value === 'views-sub') {
    drawCharts('viewsPerSubs', 'subs', 'views');
  } else if (value === 'views-upload') {
    drawCharts('viewsPerUpload', 'uploads', 'views');
  } else if (value === 'views-days') {
    drawCharts('viewsPerDays', 'days', 'views');
  }
}

$('input[name="views-toggle"]').change(settingsChanged);
$('#trim-data').change(settingsChanged);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function makeRows(results, id, data) {
  let circle = '<svg width="10" height="10"><circle r="5" fill="#EA2489" cx="5" cy="5"></circle></svg>';
  let maxUpload = d3.max(data, d => d.uploads);
  let maxViews = d3.max(data, d => d.views);
  let maxSubs = d3.max(data, d => d.subs);
  let maxDays = d3.max(data, d => d.days);

  let div = d3.select('body').append("div")
    .attr("class", "table-tooltip")
    .style("opacity", 0);

  let table = d3.select(id);

  let row = table.selectAll('tr')
    .data(results)
    .enter()
    .append('tr');

  row.append('td')
    .attr('class', 'icon')
    .html(d => (d.topInfluencer === 'y' ? '<img src="css/star.svg">' : '<img src="css/face.svg">'));

  row.append('td')
    .attr('class', 'name')
    .text(d => d.name);

  row.append('td')
    .attr('class', 'uploads')
    .html(circle)
    .style('opacity', d => (d.uploads / maxUpload) * 1)
    .on("mouseover", function (d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html('total uploads: <br />' + numFormat(d.uploads))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  row.append('td')
    .attr('class', 'views')
    .html(circle)
    .style('opacity', d => (d.views / maxViews) * 3)
    .on("mouseover", function (d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html('views: <br />' + numFormat(d.views))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  row.append('td')
    .attr('class', 'subs')
    .html(circle)
    .style('opacity', d => (d.subs / maxSubs) * 3)
    .on("mouseover", function (d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html('subscribers: <br />' + numFormat(d.subs))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  row.append('td')
    .attr('class', 'days')
    .html(circle)
    .style('opacity', d => (d.days / maxDays) * 1)
    .on("mouseover", function (d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html('days since creation of channel: <br />' + numFormat(d.days))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}