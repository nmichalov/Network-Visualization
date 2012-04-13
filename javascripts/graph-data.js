data = [{x:300,y:300,count:30,country:"China"},
        {x:100,y:100,count:10,country:"USA"},
        {x:450,y:475,count:10,country:"UK"}];

var width = 960,
    height = 500,
    fill = d3.scale.category20(),
    links = []; //enter user link data here

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

vis.on("mouseover", function() {
    var flag = d3.select(this);
    console.log(flag);
});


vis.on("mousedown", function() {
    data.forEach(function(target) {
        for (i=0;i<data.length;i++) {
            links.push({source: data[i], target: target});
        ;}
    });
    restart();
});


function restart() {
    vis.selectAll("line.link")
        .data(links)
      .enter().insert("svg:line", "rect.node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    vis.selectAll("rect.node")
        .data(data)
      .enter().insert("svg:rect", "rect.cursor")
        .attr("class", "node")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("height", function(d) { return d.count   })
        .attr("width",  function(d) { return 2*d.count })
        .attr("title",  function(d) { return d.country })
        .call(force.drag);

    force.start();
};

//node.append("title")
  //  .text(function(d) {return d.country; });
