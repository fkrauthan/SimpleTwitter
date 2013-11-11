//----------------------------------------------------------------------
// Include common libs
//----------------------------------------------------------------------
var mongoose = require('mongoose');
var program = require('commander');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');


//----------------------------------------------------------------------
// Configuration
//----------------------------------------------------------------------
var Config = require(__dirname + '/../../config.json');
var Package = require(__dirname + '/../../package.json');


//----------------------------------------------------------------------
// Setup the database connection
//----------------------------------------------------------------------
mongoose.connect(Config.mongoose.uri, Config.mongoose.options);

require(__dirname + '/models');


var User = mongoose.model('User');


//----------------------------------------------------------------------
// Setup main application
//----------------------------------------------------------------------
program
	.version(Package.version);
	
program
	.command('register')
	.description('register a new user')
	.action(function() {
		console.log('Register a new user');
		
		var user = {
		};
		async.series([
				function(callback) {
					program.prompt('Username: ', function(username) {
						user.username = username;
						callback(null, user.username);
					});
				},
				function(callback) {
					program.password('Password: ', function(password) {
						user.password = password;
						callback(null, user.password);
					});
				},
				function(callback) {
					program.prompt('E-Mail: ', function(email) {
						user.email = email;
						callback(null, user.email);
					});
				},
				function(callback) {
					program.prompt('Name: ', function(name) {
						user.name = name;
						callback(null, user.name);
					});
				}
			], function(err, results) {
				console.log('');
				console.log('Are the following data correct:');
				console.log(' Username: ' + user.username);
				console.log(' Email:    ' + user.email);
				console.log(' Name:     ' + user.name);
				
				program.confirm('continue? ', function(ok) {
					console.log('');
					if(ok) {
						bcrypt.hash(user.password, null, null, function(err, hash) {
							if(err) {
								console.log('There was an error while hashing the password: ' + err);
							}
							else {
								user.password = hash;
								user = new User(user);
								user.save(function(err) {
									if(err) {
										console.log('There was an error while storing the new user to the database: ' + err);
									}
									else {
										console.log('A new user was created with the id '+user.id);
									}
								});
							}	
						});
					}
					else {
						console.log('Creating the user was canceld');
					}
				});
			});
	});


//----------------------------------------------------------------------
// Run main application
//----------------------------------------------------------------------  
program.parse(process.argv);
