
var CONFIG = require(__dirname + '/../config.json');
var PACKAGE = require(__dirname + '/../package.json');
var async = require('async');
var Sequelize = require('sequelize');
var uid = require(__dirname + '/utils/uid');


// Check for parameters
var parametersPassed = process.argv.length > 2;

// Define program options
var program = require('commander');
program
    .version(PACKAGE.version)
    .option('-d, --database', 'Sync the database')
    .option('-c, --createClient', 'Create a oauth client')
    .parse(process.argv);


//Print help if there are no commands specified
if(!parametersPassed) {
    program.help();
}


// Connect to database
var sequelize = new Sequelize(CONFIG.database.database, CONFIG.database.username, CONFIG.database.password, CONFIG.database.options);

// Sync all entites
var Client = sequelize.import(__dirname + '/models/Client');
var AccessToken = sequelize.import(__dirname + '/models/AccessToken');
var User = sequelize.import(__dirname + '/models/User');
var Tweet = sequelize.import(__dirname + '/models/Tweet');
var UserFollow = sequelize.import(__dirname + '/models/UserFollow');
require(__dirname + '/models/mappings')(sequelize);


// Prepare the prompt
var prompt = require('prompt');
prompt.start();


// Process commands
function processCommands() {
    async.series([
        function(callback) {
            if(!program.createClient) {
                callback();
                return;
            }

            prompt.get(['clientName'], function(err, result) {
                if(err) {
                    throw err;
                }

                Client.create({
                    'name': result.clientName,
                    'consumerKey': uid(32),
                    'consumerSecret': uid(64),
                    'enabled': true
                }).success(function (client) {
                        console.log('OAuth Client created: ', client.toJSON());
                        callback();
                    })
                    .error(function (error) {
                        console.log('Error: ', error);
                        callback();
                    });
            });
        }], function(err, results) {
        });
}


// Connect to database
if(program.database) {
    sequelize.sync({force: true}).complete(function(err) {
        if(err) {
            throw err[0];
        }

        console.log('Database synced');
        processCommands();
    });
}
else {
    sequelize.sync().complete(function(err) {
        if(err) {
            throw err[0];
        }

        processCommands();
    });
}
