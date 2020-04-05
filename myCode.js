var w = 1300,
  h = 700;

var body = d3.select('body');

body.append('h1')
  .attr('id', 'title')
  .text('Movie Sales')

body.append('div')
  .attr('id', 'description')
  .text('Top 100 Highest Grossing Movies Grouped By Genre')


var tooltip = body.append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

var svg = body.append('svg')
  .attr('id', 'treemap')
  .attr('width', w)
  .attr('height', h)

var promise = d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
promise.then(function (data) {

  var treemapLayout = d3.treemap()
    .size([w, h])
  // .paddingOuter(25);

  var rootNode = d3.hierarchy(data)

  rootNode.sum(function (d) {
    return d.value;
  });

  treemapLayout(rootNode);

  var genres = [];
  var gNodes = svg.selectAll('g')
    .data(rootNode.descendants())
    .enter()
    .append('g')
    .attr('g-attr', function (d) {
      if (d.children != null && d.data.name !== 'Movies') {
        genres.push(d.data.name);
      }
    })
    .attr('transform', function (d) { return 'translate(' + [d.x0, d.y0] + ')' })

  var color = d3.scaleSequential()
    .domain([0, genres.length])
    .interpolator(d3.interpolateRainbow);

  gNodes.append('rect')
    .classed('tile', true)
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .attr('data-name', function (d) { return d.data.name })
    .attr('data-category', function (d) {
      return d.data.category ? d.data.category : d.data.name
    })
    .attr('data-value', function (d) { return d.value })
    .attr('fill', function (d) {
      if (d.children == null) {
        return color(genres.indexOf(d.parent.data.name))
      } else {
        return 'white'
      }
    })
    .on("mouseover", function (d) {
      tooltip.style("opacity", .9);
      tooltip.html(
        'Name: ' + d.data.name +
        '<br>Genre: ' + d.data.category +
        '<br>Value: ' + d.data.value
      )
        .attr("data-value", d.data.value)
        .style("left", d3.event.pageX + 10)
        .style("top", d3.event.pageY - 28);
    })
    .on("mouseout", function (d) {
      tooltip.style("opacity", 0);
    })

  gNodes.append('text')
    .attr('class', 'tile-text')
    .selectAll("tspan")
    .data(function (d) { return d.data.name.trim().length < 14 ? [d.data.name] : d.data.name.split(/(?=[A-Z][^A-Z\s])/g); })
    .enter().append("tspan")
    .attr("x", 4)
    .attr("y", function (d, i) { return 13 + i * 10; })
    .text(function (d) { return d; });

  // Legend
  var legendSvg = body.append('svg')
    .attr('id', 'legend')
    .attr('width', 160 * genres.length)

  var legendNodes = legendSvg.selectAll('g')
    .data(genres)
    .enter()
    .append('g')

  legendNodes.append('rect')
    .classed('legend-item', true)
    .attr('x', function (d, i) { return 160 * i })
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', function (d) { return color(genres.indexOf(d)) })

  legendNodes.append('text')
    .attr('dx', 30)
    .attr('dy', 13)
    .attr('x', function (d, i) { return 160 * i })
    .text(function (d) { return d })



})
