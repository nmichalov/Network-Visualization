//Data URL(s)
var dataURL =  'https://api.twitter.com/1/trends/available.json';

//Set Global Variables
var width  = 910,
    height = 300,
    hub    = "Total";


//Initialize Visualization    
var vis = d3.select(".data").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

vis.append("svg:rect")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .size([width, height])
    .charge(-120);

force.on("tick", function() {
    vis.selectAll("line.link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    vis.selectAll("g.node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
   })

//Get Data And Create Graph
//The Assumption Is That This Data Comes As An Array Of JSON Objects
$.ajax({
    url: dataURL,
    dataType: "jsonp",
    jsonpCallback: "visualizeData"
});

function visualizeData(data){

    var graphNodes  = [],          //save JSON objects 
        nodeTracker = {},
        graphLinks  = [];         //create empty array for links (graph edges)

    var j = 0;
    $.each(data, function(key,val){
        if (val.country){
            if (!(nodeTracker.hasOwnProperty(val.country))){
                nodeTracker[(val.country)] = [j];
                graphNodes[j] = ({"name": val.country, "activity": 1});
                j += 1;
            }
            else{
                graphNodes[nodeTracker[val.country]].activity += 1;
            }
        }
    })

    graphNodes.splice(0,0,{"name": hub, "activity": 0});  //Insert the graph's central node element

    for (i=1;i<graphNodes.length;i++){                                             //link all nodes to the central hub, start at 1 to avoid linking hub to self
        graphNodes[0].activity = graphNodes[0].activity + graphNodes[i].activity;  //and give hub activity count = to sum of other node's activity counts
        graphLinks[i-1] = {"source": graphNodes[0], "target": graphNodes[i]};        //enter links into link array
    }

    force        
        .nodes(graphNodes) //assign graphNodes as node data
        .links(graphLinks) //assign graphLinks as link data
        .linkDistance(function(d) { return (d.source.activity+d.target.activity)*5/7 })
        .start();          //create d3 objects used to generate visualization
        
    var links = vis.selectAll("line.link").data(graphLinks); //create variable which identifies all link elements
    var nodes = vis.selectAll("g.node").data(graphNodes);    //create variable which identifies all node elements

    links
      .enter().append("svg:line")    //create a DOM object for each link
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    links
        .transition();   //animate the transition for links between graphs

    links
        .exit()         //remove links without values
        .remove();


    nodes
      .enter().append("svg:g")  //create a DOM object for each node
        .attr("class", "node")
        .call(force.drag);

    nodes
        .transition();  //animate the transition for nodes between graphs

    nodes
        .exit()     //remove nodes without values
        .remove();
    
    nodes
       .selectAll("image.circle") //remove all previously drawn node images
       .remove();

    nodes
        .selectAll("title")  //remove titles
        .remove();


    nodes
        .append("svg:image") //insert images for all nodes currently present
            .attr("class", "circle")
            .attr("xlink:href", function(d) { return "imgs/flags/"+d.name+".png"; }) //"http://www.translationhub.com/resources/world-flags/flags/"+d.name+".png"; })
            .attr("x"  ,        function(d) { return -(25+d.activity/2)/2;  })
            .attr("y"  ,        function(d) { return -(25+d.activity/2)/2;  })
            .attr("height",     function(d) { return  25+d.activity/2;      })
            .attr("width",      function(d) { return  25+d.activity/2;      });

    nodes //assign new titles to graph elements
        .append("title")
            .text(function(d) { return d.name+'\n'+d.activity+' participants'; });
    
};
