
var CONFIG = require(__dirname + '/../config.json');
var Sequelize = require('sequelize');


// Connect to database
var sequelize = new Sequelize(CONFIG.database.database, CONFIG.database.username, CONFIG.database.password, CONFIG.database.options);

// Sync all entites
var Client = sequelize.import(__dirname + '/models/Client');
var AccessToken = sequelize.import(__dirname + '/models/AccessToken');
var User = sequelize.import(__dirname + '/models/User');
var Tweet = sequelize.import(__dirname + '/models/Tweet');
var UserFollow = sequelize.import(__dirname + '/models/UserFollow');
require(__dirname + '/models/mappings')(sequelize);


// Prepare web service
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var responseTime = require('response-time');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(responseTime({digits: 5}));

if (process.env.NODE_ENV === 'development') {
    var errorhandler = require('errorhandler');
    app.use(errorhandler())
}


// Setup auth
var passport = require('passport');
app.use(passport.initialize());
require(__dirname + '/auth/setup')(sequelize);


// Prepare api calls
require(__dirname + '/auth/api')(app, sequelize);
require(__dirname + '/api/index')(app, sequelize);


// Connect to database and start web service
var fs = require('fs');
var http = require('http');
var https = require('https');

if(!('bind' in CONFIG)) {
    CONFIG.bind = '0.0.0.0';
}

sequelize.sync().complete(function(err) {
    if(err) {
        throw err[0];
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
});
