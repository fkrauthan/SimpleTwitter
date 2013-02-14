//----------------------------------------------------------------------
// Include common libs
//----------------------------------------------------------------------
var express = require('express');
var expressError = require('express-error');
var http = require('http');
var https = require('https');

var mongoose = require('mongoose');


//----------------------------------------------------------------------
// Configuration
//----------------------------------------------------------------------
var Config = require(__dirname + '/config.json');

if(!('port' in Config)) {
	Config.port = 2013;
}

if(!('bind' in Config)) {
	Config.bind = '0.0.0.0';
}

if(!('serveApp' in Config)) {
	Config.serveApp = true;
}

if(!('logging' in Config)) {
	Config.logging = false;
}


global.DEBUG = process.env.NODE_ENV == 'development';


//----------------------------------------------------------------------
// Setup the database connection
//----------------------------------------------------------------------
mongoose.connect(Config.mongoose.uri, Config.mongoose.options);

require(__dirname + '/models');


//----------------------------------------------------------------------
// Setup the basic webserver
//----------------------------------------------------------------------

var app = express();
app.configure(function() {
	//Enable static file serving
	if(Config.serveApp === true) {
		app.use(express.static(__dirname + '/../client'));
		app.get('/', function(req, res) {
			res.sendFile(__dirname + '/../client/index.html');
		});
	}
	
	//Enable logging
	if(Config.logging === true || DEBUG === true) {
		app.use(express.logger());
	}

	//Initialize the api callbacks
	require(__dirname + '/api').init(app);
	
	//Enable error handling
	app.use(function(req, res, next) {
		res.statusCode = 404;
		res.sendFile(__dirname + '/errors/404.html');
	});
	if(DEBUG) {
		app.use(expressError.express3({contextLinesCount: 3, handleUncaughtException: true}));
	}
	else {
		app.use(function(err, req, res, next) {
			res.statusCode = 500;
			res.sendFile(__dirname + '/errors/500.html');
		});
	}
});

//Start webapp
if('ssl' in Config && 'enabled' in Config.ssl && 'key' in Config.ssl && 'cert' in Config.ssl && Config.ssl.enabled == true) {
	var keyFile = Config.ssl.key;
	if(keyFile && keyFile.charAt(0) != '/') {
		keyFile = __dirname + '/' + keyFile;
	}
	
	var certFile = Config.ssl.cert;
	if(certFile && certFile.charAt(0) != '/') {
		certFile = __dirname + '/' + certFile;
	}
	
	var options = {
		key: fs.readFileSync(keyFile),
		cert: fs.readFileSync(certFile),
	};
	
	if(!('bind' in Config.ssl)) {
		Config.ssl.bind = Config.bind;
	}
	
	if(!('port' in Config.ssl)) {
		Config.ssl.port = Config.port;
	}

	var server = https.createServer(options, app).listen(Config.ssl.port, Config.ssl.bind, function(){
		console.log('Server listening for https on ' + Config.ssl.bind + ':' + Config.ssl.port);
	});
}

var server = http.createServer(app).listen(Config.port, Config.bind, function(){
	console.log('Server listening for http on ' + Config.bind + ':' + Config.port);
});

