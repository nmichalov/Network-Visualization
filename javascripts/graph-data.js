//Data URL(s)
var rawData1 = "http://0.0.0.0:8888/data.json",
    rawData2 = "http://0.0.0.0:8888/data1.json";


//Set Global Variables
var width  = 910,
    height = 300
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
    .linkDistance(150)
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
function visualizeData(dataURL){
    $.getJSON(dataURL, function(data) {  //get JSON array from URL

        var graphNodes = data,           //save JSON objects 
            graphLinks = [];             //create empty array for links (graph edges)

        graphNodes.splice(0,1,{"name": hub, "activity": 0});  //Insert the graph's central node element

        for (i=0;i<graphNodes.length;i++){                                             //link all nodes to the central hub
            graphNodes[0].activity = graphNodes[0].activity + graphNodes[i].activity;  //and give hub activity count = to sum of other node's activity counts
            graphLinks[i] = {"source": graphNodes[0], "target": graphNodes[i]};        //enter links into link array
        }

        force                  
            .nodes(graphNodes) //assign graphNodes as node data
            .links(graphLinks) //assign graphLinks as link data
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
                .attr("xlink:href", function(d) { return "imgs/"+d.name; })
                .attr("x"  ,        function(d) { return -d.activity/2;  })
                .attr("y"  ,        function(d) { return -d.activity/2;  })
                .attr("height",     function(d) { return  d.activity;    })
                .attr("width",      function(d) { return  d.activity;    });

        nodes //assign new titles to graph elements
            .append("title")
                .text(function(d) { return d.name+'\n'+d.activity+' participants'; });
        
             })
};
visualizeData(rawData1);
setTimeout(function() { visualizeData(rawData2) }, 5000);
