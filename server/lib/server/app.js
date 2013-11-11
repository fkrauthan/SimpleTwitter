//----------------------------------------------------------------------
// Include common libs
//----------------------------------------------------------------------
var express = require('express');
var expressError = require('express-error');
var http = require('http');
var https = require('https');

var mongoose = require('mongoose');

var path = require('path');


//----------------------------------------------------------------------
// Configuration
//----------------------------------------------------------------------
var Config = require(__dirname + '/../../config.json');

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

if(!('printPort' in Config)) {
	Config.printPort = true;
}

if(!('registration' in Config)) {
	Config.registration = false;
}


global.DEBUG = process.env.NODE_ENV == 'development';


//----------------------------------------------------------------------
// Configuration if appfog deployment
//----------------------------------------------------------------------
if('VMC_APP_PORT' in process.env) {
	//Disable ssl
	if('ssl' in Config) {
		delete Config.ssl;
	}
	//Overwrite port and host
	Config.port = process.env.VMC_APP_PORT
	Config.bind = '0.0.0.0';
	
	Config.printPort = false;
}
if('MONGOLAB_URI' in process.env) {
	Config.mongoose.options = null;
	Config.mongoose.uri = process.env.MONGOLAB_URI;
}


//----------------------------------------------------------------------
// Setup the database connection
//----------------------------------------------------------------------
mongoose.connect(Config.mongoose.uri, Config.mongoose.options);
mongoose.set('debug', true);

require(__dirname + '/models');


//----------------------------------------------------------------------
// Setup the basic webserver
//----------------------------------------------------------------------

var app = express();
app.configure(function() {
	//Enable logging
	if(Config.logging === true || DEBUG === true) {
		app.use(express.logger());
	}
	
	//Enable body parsing and method overriding
	app.use(express.urlencoded())
	app.use(express.json())
	app.use(express.methodOverride());
	
	//Enable routing
	app.use(app.router);
	
	//Enable static file serving
	if(Config.serveApp === true) {
		app.use(express.static(__dirname + '/../../../client'));
	}
	
	//Enable error handling
	app.use(function(req, res, next) {
		res.statusCode = 404;
		
		var filePath = path.resolve(__dirname + '/../../views/errors/404.html');
		res.sendfile(filePath);
	});
	if(DEBUG) {
		app.use(expressError.express3({contextLinesCount: 3, handleUncaughtException: true}));
	}
	else {
		app.use(function(err, req, res, next) {
			res.statusCode = 500;
			
			var filePath = path.resolve(__dirname + '/../../views/errors/500.html');
			res.sendfile(filePath);
		});
	}
});

//Enable static index serving
if(Config.serveApp === true) {
	app.get('/', function(req, res) {
		var filePath = path.resolve(__dirname + '/../../../client/index.html');
		res.sendfile(path.normalize(filePath));
	});
}

//Enable static config serving
app.get('/config.js', function(req, res) {
	console.log(req.path);
	res.setHeader('Content-Type', 'application/javascript');
	
	var ret = 'var API_URL = \'' + req.protocol + '://' + req.host;
	if(Config.printPort) {
		ret += ':' + (req.secure ? Config.ssl.port : Config.port);
	}
	ret += '/api\';';
	ret += 'var REGISTRATION_ENABLED='+Config.registration+';';
	
	res.send(ret);
});

//Initialize authentication
require(__dirname + '/auth').init(app, Config);

//Initialize the api callbacks
require(__dirname + '/api').init(app, Config);

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
