
var url = require('url');
var expires = require('expires');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');


var TokenStorage = {};
var EXPIRES_AFTER = '1 hours';
var TOKEN_SALT = '';

function loadUserByUsername(username, callback) {
	var User = mongoose.model('User');
	User.findOne({'username': username}, function (err, user) {
		if(err) {
			return callback(err, null);
		}
		callback(null, user);
	});
}

function authenticateUser(username, password, callback) {
	loadUserByUsername(username, function(err, user) {
		if(err) {
			return callback(err, null);
		}
		
		if(!user) {
			return callback(null, null, 'Username or password is invalid');
		}
		
		bcrypt.compare(password, user.password, function(err, res) {
			if(err) {
				return callback(err, null);
			}
			if(res === false) {
				return callback(null, null, 'Username or password is invalid');
			}
			return callback(null, user);
		});
	});
}

function buildAuthToken(username, callback) {
	var expireTime = expires.after(EXPIRES_AFTER);
	generateToken(username, expireTime, function(err, authToken) {
		return callback(err, authToken, expireTime);
	});
}

function generateRawToken(username, expireTime) {
	return username + '+' + expireTime + '+' + TOKEN_SALT;
}

function generateToken(username, expireTime, callback) {
	bcrypt.hash(generateRawToken(username, expireTime), null, null, function(err, hash) {
		if(err) {
			return callback(err, null);
		}
		
		callback(null, hash);
	});
}

function checkAuthentication(req, res, callback) {
	if(!req.get('authorization')) {
		return res.json({'error': 'No authorization header send'}, 401);
	}
	
	var header=req.get('authorization') || '',
		token = header.split(/\s+/).pop() || '',
		auth = new Buffer(token, 'base64').toString(),
		parts = auth.split(/:/),
		username = parts[0],
		token = parts[1];
		expireTime = parts[2];
	
	if(!DEBUG && !(token in TokenStorage)) {
		return callback('Auth token is invalid', null);
	}
	
	if(expires.expired(expireTime)) {
		return res.json({'error': 'Auth token is expired'}, 401);
	}

	bcrypt.compare(generateRawToken(username, expireTime), token, function(err, res) {
		if(err) {
			callback(err, null);
		}
		else {
			if(res === true) {
				loadUserByUsername(username, function(err, user) {
					if(err) {
						return callback(err, null);
					}
					return callback(null, user, token);
				});
			}
			else {
				return callback('Auth token is invalid', null);
			}
		}
	});
}

function authenticate(req, res, next) {
	checkAuthentication(req, res, function(err, user, authToken) {
		if(err) {
			return res.json({'error': err}, 500);
		}
		
		req.user = user;
		req.authToken = authToken;
		next();
	});
}

function authenticateRoles(roles) {
	return function(req, res, next) {
		exports.authenticate(req, res, function() {
			//TODO check user roles
			next();
		});
	};
}

exports.init = function(app, Config) {
	if('auth' in Config && 'expires' in  Config.auth) {
		EXPIRES_AFTER = Config.auth.expires;
	}
	if('auth' in Config && 'salt' in  Config.auth) {
		TOKEN_SALT = Config.auth.salt;
	}
	
	app.post('/api/login', function(req, res) {
		authenticateUser(req.body.username, req.body.password, function(err, user, authFailure) {
			if(err) {
				return next(err);
			}
			if(!user) {
				return res.json({'error': authFailure}, 401);
			}
			req.user = user;
						
			buildAuthToken(user.username, function(err, authToken, expireTime) {
				if(err) {
					return res.json({'error': 'Couldn\'t create auth token'}, 500);
				}
				req.authToken = authToken;
				if(!DEBUG) {
					TokenStorage[authToken] = true;
				}
				
				var respUser = {
					'username': user.username,
					'email': user.email,
					'name': user.name,
					'registered': user.registered
				}
				
				return res.json({'authToken': authToken, 'expireTime': expireTime, 'user': respUser});
			});
		});
	});
	app.get('/api/logout', authenticate, function(req, res) {
		if(!DEBUG) {
			delete TokenStorage[req.authToken];
		}
		return res.json({'loggedout': true});
	});
	
};

exports.authenticate = authenticate;
exports.authenticateRoles = authenticateRoles;
