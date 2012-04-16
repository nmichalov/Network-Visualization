*Network Visualization*

An admittedly misleadingly named network activity visualization tool which represents the amount of activity occurring at each node (and not, as one might 
expect, the organization of the network).  

Written in JavaScript, data visualization is accomplished with d3.  Input is a set of JSON objects with values corresponding to each node's identifier, and 
the amount of activity occurring within each node.  Each node is represented by a unique image, the size of which correlates positively and linearly with 
the amount of activity within the node.

I'm currently working on an implementation which utilizes websockets for real time visualization.
