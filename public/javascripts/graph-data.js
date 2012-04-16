/*data = [{count:106,country:"Lantern"},
        {count:30,country:"China"},
        {count:40,country:"USA"},
        {count:30,country:"UK"},
        {count:15,country:"Australia"},
        {count:22,country:"Brazil"},
        {count:33,country:"Iran"},
        {count:26,country:"North Korea"}];
*/

var rawData = "/data.json"; 

var width = 910,
    height = 300,
    links = [];

var force = d3.layout.force()
    //.nodes(data)
    //.links(links)
    .size([width, height])
    .linkDistance(100)
    .charge(-120);
    //.start();

var vis = d3.select(".data").append("svg:svg")
    .attr("width", width)
    .attr("height", height);


vis.append("svg:rect")
    .attr("width", width)
    .attr("height", height);

d3.json(rawData, function(json) {    
    console.log(json);
    data = json.data;

    var link = vis.selectAll("line.link")
        .data(links)
      .enter().append("svg:line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    var node = vis.selectAll("g.node")
        .data(data)
      .enter().append("svg:g")
        .attr("class", "node")
        .call(force.drag);

    json.data.forEach(function(target) {
        links.push({source: json.data[0], target: target});
    });
       
    force
        .nodes(data)
        .links(links)
        .on("tick", tick)
        .start();

    function tick() {

        node.append("svg:image")
            .attr("class", "circle")
            .attr("xlink:href", function(d) { return "imgs/"+d.country; })
            .attr("x", function(d) { return -d.count/2; })
            .attr("y", function(d) { return -d.count/2; })
            .attr("height", function(d) { return d.count;  })
            .attr("width",  function(d) { return d.count;  })
            .attr("dx", 9)
            .attr("dy", ".25em");

        node.append("title")
            .text(function(d) { return d.country+'\n'+d.count+' users'; });

       //force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    //});
    };
});

//force.start();

