require('./api/data/db.js');
var express = require('express');
var app = express();
var path = require('path');	
var bodyParser = require('body-parser');

var routes = require('./api/routes');

//define port to run
app.set('port', 3000);

//add middleware to console log every request
app.use(function(request, response, next){
	console.log(request.method, request.url);
	next();
});

//set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'))

//enable parsing of posted forms
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//add some routing
app.use('/api', routes);

var server = app.listen(app.get('port'), function(){
	var port = server.address().port;
	console.log("this is port" + port);
});
