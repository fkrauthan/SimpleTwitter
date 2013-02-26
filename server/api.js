
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
		var User = mongoose.model('User');
		User.findOne({'username': req.user.username}, function(err, user) {
			if(err) {
				console.log('There was an error while loading data from the database: ', err);
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			
			if(!user) {
				console.log('No user with this username was not found');
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			
			var followerMap = {};
			for(var i=0; i<user.following.length; i++) {
				followerMap[user.following[i].userId] = 1;
			}
			
			User.find({}, {'username': 1, 'name': 1}, {'sort': {'username': 1}}, function(err, users) {
				if(err) {
					console.log('There was an error while loading data from the database: ', err);
					return res.json({'error': 'Couldn\'t load user'}, 500);
				}
				
				for(var i=0; i<users.length; i++) {
					if(users[i].id in followerMap) {
						users[i].follow = true;
					}
					else {
						users[i].follow = false;
					}
					users[i] = users[i].toObject({virtuals: false});
				}
				
				res.json({'users': users});
			});
		});
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
	
	app.put('/api/users/:username/follow', auth.authenticate, function(req, res) {
		var User = mongoose.model('User');
		User.findOne({'username': req.params.username}, {'id': 1, 'username': 1, 'name': 1}, function(err, following) {
			if(err) {
				console.log('There was an error while loading data from the database: ', err);
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			if(!following) {
				console.log('No user with this username was not found');
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			if(req.user.id === following.id) {
				return res.json({'error': 'You can\'t follow your self'}, 500);
			}
					
			User.update({'_id': req.user.id}, {'$push': { following: { userId: following.id, 'username': following.username, 'name': following.name } } }, function(err, numberAffected, raw) {
				if(err) {
					console.log('Couldn\'t save user');
					return res.json({'error': 'Couldn\'t save user'}, 500);
				}
				
				console.log('The user with id ' + req.user.id + ' follow now the user with id ' + following.id);
				return res.json({'successful': true});
			});
		});
	});
	
	app.put('/api/users/:username/unfollow', auth.authenticate, function(req, res) {
		var User = mongoose.model('User');
		User.findOne({'username': req.params.username}, {'id': 1, 'username': 1, 'name': 1}, function(err, following) {
			if(err) {
				console.log('There was an error while loading data from the database: ', err);
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			if(!following) {
				console.log('No user with this username was not found');
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			if(req.user.id === following.id) {
				return res.json({'error': 'You can\'t unfollow your self'}, 500);
			}
			
			User.update({'_id': req.user.id}, {'$pull': { following: { userId: following.id } } }, function(err, numberAffected, raw) {
				if(err) {
					console.log('Couldn\'t save user');
					return res.json({'error': 'Couldn\'t save user'}, 500);
				}
				
				console.log('The user with id ' + req.user.id + ' unfollowed the user with id ' + following.id);
				return res.json({'successful': true});
			});
		});
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
        
	app.get('/api/users/:username/dashboard', auth.authenticate, function(req, res) {
		if(req.params.username !== req.user.username) {
			return res.json({'error': 'You are not allowed to see another user\'s dashboard'}, 403);
		}

		var User = mongoose.model('User');
		var Tweet = mongoose.model('Tweet');
		
		User.findOne({'username': req.user.username}, function(err, user) {
			if(err) {
				console.log('There was an error while loading data from the database: ', err);
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			
			if(!user) {
				console.log('No user with this username where found');
				return res.json({'error': 'Couldn\'t load user'}, 500);
			}
			
			var idList = [user.id];
			for(var i=0; i<user.following.length; i++) {
				idList.push(user.following[i].userId);
			}
			
			Tweet.find().where('author.userId').in(idList).sort({'timestamp': -1}).exec(function(err, tweets) {
				if(err) {
					console.log('There was an error while loading data from the database: ', err);
					return res.json({'error': 'Couldn\'t load tweets for the user dashboard'}, 500);
				}
				res.json({'tweets': tweets});
			});
		});
	});
	
	app.post('/api/users/:username/tweets', auth.authenticate, function(req, res) {
		if(req.params.username !== req.user.username) {
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
