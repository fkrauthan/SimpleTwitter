
var CONFIG = require(__dirname + '/../config.json');
var development = process.env.NODE_ENV !== 'production';


// Prepare jsx
require('node-jsx').install({ 'extension': '.jsx' });


// Prepare web server
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var responseTime = require('response-time');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(responseTime({digits: 5}));

if (development) {
    var errorhandler = require('errorhandler');
    app.use(errorhandler())
}


// Configure browserify
if (development) {
    var browserify  = require('connect-browserify');

    app.get('/assets/bundle.js',
        browserify(__dirname + '/../client', {
            debug: true,
            watch: true
        }));
}


// Setup other routes
var renderApp = require(__dirname + '/render')(CONFIG);
var apiProxy = require(__dirname + '/proxy')(CONFIG);

app
    .use('/assets', express.static(__dirname + '/../assets'))
    .use('/api', apiProxy)
    .use(renderApp);


// Start web server
var fs = require('fs');
var http = require('http');
var https = require('https');

if(!('bind' in CONFIG)) {
    CONFIG.bind = '0.0.0.0';
}

if('ssl' in CONFIG && 'enabled' in CONFIG.ssl && 'key' in CONFIG.ssl && 'cert' in CONFIG.ssl && CONFIG.ssl.enabled == true) {
    var keyFile = CONFIG.ssl.key;
    if(keyFile && keyFile.charAt(0) != '/') {
        keyFile = __dirname + '/' + keyFile;
    }

    var certFile = CONFIG.ssl.cert;
    if(certFile && certFile.charAt(0) != '/') {
        certFile = __dirname + '/' + certFile;
    }

    var options = {
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile)
    };

    if(!('bind' in Config.ssl)) {
        CONFIG.ssl.bind = CONFIG.bind;
    }

    if(!('port' in Config.ssl)) {
        CONFIG.ssl.port = CONFIG.port;
    }

    var httpsServer = https.createServer(options, app).listen(CONFIG.ssl.port, CONFIG.ssl.bind, function(){
        console.log('Server listening for https on https://' + CONFIG.ssl.bind + ':' + CONFIG.ssl.port);
    });
}


var httpServer = http.createServer(app).listen(CONFIG.port, CONFIG.bind, function(){
    console.log('Server listening for http on ' + CONFIG.bind + ':' + CONFIG.port);
});