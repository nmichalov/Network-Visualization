data = [{x:300,y:300,count:30,country:"China",flag:"imgs/China.png"},
        {x:100,y:100,count:10,country:"USA",flag:"imgs/USA.png"},
        {x:450,y:475,count:10,country:"UK",flag:"http://images3.wikia.nocookie.net/__cb20090205233127/fallout/images/b/b6/UK_Flag.png"}];

var width = 960,
    height = 500,
    //fill = d3.scale.category20(),
    links = [];

data.forEach(function(target) {
    for (i=0;i<data.length;i++) {
        links.push({source: data[i], target: target});
    ;}
});

var vis = d3.select("body").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

vis.append("svg:rect")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .nodes(data)
    .links(links)
    .size([width, height])
    .linkDistance(70);

var cursor = vis.append("svg:rect")
    .attr("width", 2)
    .attr("height", 2)
    .attr("transform", "translate(-100,100)")
    .attr("class", "cursor");


    
force.on("tick", function() {
    vis.selectAll("line.link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    vis.selectAll("rect.node")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
});



vis.on("mousemove", function() {
    cursor.attr("transform", "translate(" + d3.svg.mouse(this) + ")");
});



vis.selectAll("line.link")
    .data(links)
  .enter().insert("svg:line", "rect.node")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

var node = vis.selectAll("rect.node")
    .data(data)
  .enter().insert("svg:rect", "rect.cursor")
    .attr("class", "node")
    .attr("xlink:href", function(d) { return d.flag })
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("height", function(d) { return d.count   })
    .attr("width",  function(d) { return 2*d.count })
    .attr("title",  function(d) { return d.country })
    .call(force.drag);


force.start();
