var width = 960,
    height = 500,
    fill = d3.scale.category20(),
    nodes = [],
    links = [];

var vis = d3.select("body").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

vis.append("svg:rect")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height]);

var cursor = vis.append("svg:circle")
    .attr("r", 1)
    .attr("transform", "translate(-100,-100)")
    .attr("class", "cursor");

force.on("tick", function() {
    vis.selectAll("line.link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    vis.selectAll("circle.node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
});

vis.on("mousemove", function() {
    cursor.attr("transform", "translate(" + d3.svg.mouse(this) + ")");
});

vis.on("mousedown", function() {
    var point = d3.svg.mouse(this),
        node = {x: point[0], y: point[1]},
    n = nodes.push(node);

    nodes.forEach(function(target) {
        var x = target.x - node.x,
            y = target.y - node.y;
        if (Math.sqrt(x * x + y * y) < 30) {
            links.push({source: node, target: target});
        }
    });

    restart();
});

function restart() {
    vis.selectAll("line.link")
        .data(links)
      .enter().insert("svg:line", "circle.node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    vis.selectAll("circle.node")
        .data(nodes)
      .enter().insert("svg:circle", "circle.cursor")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 5)
        .call(force.drag);

    force.start();
}
