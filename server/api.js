
var auth = require(__dirname + '/auth');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


exports.init = function(app, Config) {

	// Two test requests to make sure the api works
	app.get('/api/ping', function(req, res) {
		res.json({'pong': true});
	});
	app.post('/api/ping', function(req, res) {
		res.json({'pong': req.body});
	});
	
	// User API
	app.get('/api/users', auth.authenticate, function(req, res) {
		res.json({'users': []});
	});
	
	if(Config.registration) {
		app.post('/api/users', function(req, res) {
			var User = mongoose.model('User');
			
			//TODO validation
			var user = new User(req.body);
			User.count().or([{'username': user.username}, {'email': user.email}]).exec(function (err, count) {
				if(err) {
					console.log('There was an error while counting existing users: ' + err);
					return res.json({'error': 'Couldn\'t hash the password'}, 500);
				}
				if(count >= 1) {
					return res.json({'error': 'A user with this username or email exists already'}, 500);
				}
				
				bcrypt.hash(user.password, null, null, function(err, hash) {
					if(err) {
						console.log('There was an error while hashing the password: ' + err);
						return res.json({'error': 'Couldn\'t hash the password'}, 500);
					}
					user.password = hash;
				
					user.save(function(err) {
						if(err) {
							console.log('There was an error while storing the user to the database: ' + err);
							return res.json({'error': 'Couldn\'t store the user'}, 500);
						}
						else {
							console.log('A new user was created with the id '+user.id);
							return res.json({'successful': true});
						}
					});
				});
			});
		});
	}
	
	// Tweet API
	app.get('/api/users/:username/tweets', auth.authenticate, function(req, res) {
		var Tweet = mongoose.model('Tweet');
		//TODO add filter functions
		Tweet.find({'author.username': req.params.username}, null, {'sort': {'timestamp': -1}}, function(err, tweets) {
			if(err) {
				console.log('There was an error while loading data from the database: ', err);
				return res.json({'error': 'Couldn\'t load tweets for the user'}, 500);
			}
			res.json({'tweets': tweets});
		});
	});
	
	app.post('/api/users/:username/tweets', auth.authenticate, function(req, res) {
		if(req.params.username != req.user.username) {
			return res.json({'error': 'You are not allowed to tweet as another user'}, 403);
		}
		
		//TODO validation
		var Tweet = mongoose.model('Tweet');
		var tweet = new Tweet({
			'author': {
				'userId': req.user.id,
				'username': req.user.username,
				'name': req.user.name
			},
			'message': req.body.message
		});
		tweet.save(function(err) {
			if(err) {
				console.log('There was an error while storing the tweet to the database: ' + err);
				return res.json({'error': 'Couldn\'t store the tweet'}, 500);
			}
			else {
				console.log('A new tweet was created with the id '+tweet.id);
				return res.json({'tweet': tweet});
			}
		});
	});
};
