//----------------------------------------------------------------------
// Include common libs
//----------------------------------------------------------------------
var express = require('express');
var expressError = require('express-error');
var http = require('http');
var https = require('https');


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
if(Config.ssl && Config.ssl.enabled == true) {
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
	
	if(!Config.ssl.bind) {
		Config.ssl.bind = Config.bind;
	}

	var server = https.createServer({}, app).listen(Config.port, Config.bind, function(){
		console.log('Server listening for https on ' + Config.ssl.bind + ':' + Config.ssl.port);
	});
}

var server = http.createServer(app).listen(Config.port, Config.bind, function(){
	console.log('Server listening for http on ' + Config.bind + ':' + Config.port);
});

