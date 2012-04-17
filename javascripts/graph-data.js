//Data URL
var rawData  = "http://0.0.0.0:8888/data.json";


//Set Global Variables
var width  = 910,
    height = 300,
    graphNodes  =  [],
    graphLinks  =  [];


//Create Instance of Above Object for Graph's Central Node
//And Push To graphNodes Array
graphNodes[0] = {"name": "Lantern", "activity" : 70 };


//Function For Processing The Incoming Data
//function 



//Initialize Visualization    
var vis = d3.select(".data").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

vis.append("svg:rect")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .size([width, height])
    .linkDistance(100)
    .charge(-120);

//Get Initial Data And Create Graph
//The Assumption Is That This Data Comes As An Array Of JSON Objects
$.getJSON(rawData, function(data) {
    $.each(data, function(key, val){
        graphNodes.push(val);
    });

    for (i=1;i<graphNodes.length;i++){
        var arc  =  {"source": graphNodes[0], "target": graphNodes[i]}; 
        if (!(graphLinks.hasOwnProperty(arc))){
            graphLinks.push(arc);
        }
    }

    force
        .nodes(graphNodes)
        .links(graphLinks)
        .start();

    var node = vis.selectAll("g.node")
        .data(graphNodes)
      .enter().append("svg:g")
        .attr("class", "node")
        .call(force.drag);

    node.append("svg:image")
            .attr("class", "circle")
            .attr("xlink:href", function(d) { return "imgs/"+d.name; })
            .attr("x"  ,        function(d) { return -d.activity/2; })
            .attr("y"  ,        function(d) { return -d.activity/2; })
            .attr("height",     function(d) { return d.activity;  })
            .attr("width",      function(d) { return d.activity;  })
            .attr("dx", 9)
            .attr("dy", ".25em");
    node.append("title")
            .text(function(d) { return d.name+'\n'+d.activity+' users'; });

   var link = vis.selectAll("line.link")
        .data(graphLinks)
      .enter().append("svg:line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

   force.on("tick", function() {
       link.attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });
       node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
   });
});
