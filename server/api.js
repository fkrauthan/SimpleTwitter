
var auth = require(__dirname + '/auth');
var mongoose = require('mongoose');


exports.init = function(app) {

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
