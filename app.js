//Dependencies
//
var express = require('express'),
    routes = require('./routes');

var app = modules.exports = express.createServer();


//Configuration
//
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});


//Routes
//
app.get('/', routes.index);
app.get('/data', routes.get_data);
app.listen(8888);
