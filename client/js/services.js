'use strict';

angular.module('simpleTwitter.services', [])
	.factory('nowTime', ['$timeout',function($timeout) {
		var nowTime;
		(function updateTime() {
			nowTime = Date.now();
			$timeout(updateTime, 1000);
		}());
		return function() {
			return nowTime;
		};
	}])
	.factory('User', function($rootScope, $http) {
		var $user = null;
		var $token = null;

		return {
			'checkForAuthorization': function() {
				if(($user == null || token === null) && typeof(Storage) !== 'undefined') {
					var token = JSON.parse(localStorage.getItem('token'));
					if(token == null || (token != null && token.expireTime<new Date().getTime())) {
						return false;
					}
					
					$user = JSON.parse(localStorage.getItem('user'));
					$token = token;
					
					$rootScope.$broadcast('login', [$user]);
					return true;
				}
				return false;
			},
			'login': function(username, password, rememberMe, onSuccess, onError) {
				$http.post(API_URL + '/login', {'username': username, 'password': password})
					.success(function(data, status, headers, config) {
						var user = data.user;
						
						$token = {
							'token': data.authToken,
							'expireTime': data.expireTime,
							'authorization': window.btoa(data.user.username+':'+data.authToken+':'+data.expireTime)
						};
						
						$user = user;
						$rootScope.$broadcast('login', [$user]);
						
						if(typeof(Storage) !== 'undefined') {
							localStorage.setItem('user', JSON.stringify($user));
							localStorage.setItem('token', JSON.stringify($token));
						}
						
						onSuccess(true, user);
					})
					.error(function(data, status, headers, config) {
						onError(data.error);
						console.log('Login error: ' + data.error);
					});
			},
			'register': function(user, onSuccess, onError) {
				$http.post(API_URL + '/users', user)
					.success(function(data, status, headers, config) {
						onSuccess();
						console.log('Registration successful');
					})
					.error(function(data, status, headers, config) {
						onError(data.error);
						console.log('Registration error: ' + data.error);
					});
			},
			'logout': function(callback) {
				$http.get(API_URL + '/logout', {'headers': {'Authorization': $token.authorization}})
					.success(function(data, status, headers, config) {
						console.log('Logout was successfull');
						
					})
					.error(function(data, status, headers, config) {
						console.log('Logout error: ' + data.error);
					});

				$rootScope.$broadcast('logout', [$user]);
				$user = null;
				$token = null;
				
				if(typeof(Storage) !== 'undefined') {
					localStorage.removeItem('user');
					localStorage.removeItem('token');
				}

				callback(true);
			},
			'getUser': function() {
				return $user;
			},
			'isLoggedIn': function() {
				return $user!=null;
			},
			'getUsername': function() {
				if($user == null) return null;
				return $user.username;
			},
			'getAPIAuthorizationHeader': function() {
				return {'headers': {'Authorization': $token.authorization}};
			}
		};
	})
	.factory('Users', ['$rootScope', '$http', 'User', function($rootScope, $http, User) {
		function Users() {
			this.users = [];
			this.init = false;
			
			var ctx = this;
			$rootScope.$on('login', function(event, args) {
				ctx.load();
			});
			$rootScope.$on('logout', function(event, args) {
				ctx.users = [];
				ctx.init = false;
			});
		}
		Users.prototype.load = function() {
			this.init = true;

			var ctx = this;
			$http.get(API_URL + '/users', User.getAPIAuthorizationHeader())
				.success(function(data, status, headers, config) {
					ctx.users.splice(0, ctx.users.length);
					for(var i=0; i<data.users.length; i++) {
						if(data.users[i].username === User.getUsername()) {
							continue;
						}
						ctx.users.push(data.users[i]);
					}
					console.log('Users sucessfully lodaded');
				})
				.error(function(data, status, headers, config) {
					console.log('There was an error while loading users: ' + data.error);
				});
		};
		Users.prototype.follow = function(user, onSuccess, onError) {
			var ctx = this;
			$http.put(API_URL + '/users/' + user.username + '/follow', {}, User.getAPIAuthorizationHeader())
				.success(function(data, status, headers, config) {
					$rootScope.$broadcast('follow', [user]);
					onSuccess();
				})
				.error(function(data, status, headers, config) {
					console.log('There was an error while following a user: ' + data.error);
					onError(data.error);
				});
		};
		Users.prototype.unfollow = function(user, onSuccess, onError) {
			var ctx = this;
			$http.put(API_URL + '/users/' + user.username + '/unfollow', {}, User.getAPIAuthorizationHeader())
				.success(function(data, status, headers, config) {
					$rootScope.$broadcast('unfollow', [user]);
					onSuccess();
				})
				.error(function(data, status, headers, config) {
					console.log('There was an error while unfollowing a user: ' + data.error);
					onError(data.error);
				});
		};
		Users.prototype.getAll = function() {
			if(!this.init) {
				this.load();
			}
			return this.users;
		};
		Users.prototype.loadByUsername = function(username, onSuccess, onError) {
			var ctx = this;
			$http.get(API_URL + '/users/' + username, User.getAPIAuthorizationHeader())
				.success(function(data, status, headers, config) {
					onSuccess(data.user);
				})
				.error(function(data, status, headers, config) {
					console.log('There was an error while loading a user: ' + data.error);
					onError(data.error);
				});
		};
		
		return new Users();
	}])
	.factory('Tweets', ['$rootScope', '$http', 'User', function($rootScope, $http, User) {
		function Tweets() {
			this.tweets = [];
			this.init = false;

			var ctx = this;
			$rootScope.$on('login', function(event, args) {
				ctx.load();
			});
			$rootScope.$on('logout', function(event, args) {
				ctx.tweets = [];
				ctx.init = false;
			});
			
			$rootScope.$on('follow', function(event, args) {
				ctx.load(true);
			});
			$rootScope.$on('unfollow', function(event, args) {
				ctx.load(true);
			});
		}
		Tweets.prototype.load = function(clear) {
			this.init = true;

			var ctx = this;
			$http.get(API_URL + '/users/' + User.getUsername() + '/dashboard', User.getAPIAuthorizationHeader())
				.success(function(data, status, headers, config) {
					if(clear) {
						ctx.tweets.splice(0, ctx.tweets.length);
					}
					for(var i=0; i<data.tweets.length; i++) {
						var tweet = data.tweets[i];
						tweet.submitted = true;
						tweet.mentions = ctx.parseMentions(tweet.message);
						tweet.hashTags = ctx.parseHashTags(tweet.message);
					}
					ctx.add(data.tweets);
						
					console.log('Tweets sucessfully lodaded');
				})
				.error(function(data, status, headers, config) {
					console.log('There was an error while loading tweets: ' + data.error);
				});
		};
		Tweets.prototype.add = function(data) {
			if(data instanceof Array) {
				for(var i=0; i<data.length; i++) {
					this.tweets.push(data[i]);
				}
				$rootScope.$broadcast('tweetsAdded', [data]);
			}
			else {
				this.tweets.push(data);
				$rootScope.$broadcast('tweetAdded', [data]);
			}
		};
		Tweets.prototype.getAll = function() {
			if(!this.init) {
				this.load();
			}
			return this.tweets;
		};
		Tweets.prototype.send = function(message) {
			var user = User.getUser();
			var tweet = {
				'author': {
					'username': user.username,
					'fullName': user.fullName
				},
				'message': message,
				'mentions': this.parseMentions(message),
				'hashTags': this.parseHashTags(message),
				'submitted': false,
				'timestamp': moment.utc().format()
			};
			this.add(tweet);
			
			$http.post(API_URL + '/users/' + User.getUsername() + '/tweets', {'message': message}, User.getAPIAuthorizationHeader())
				.success(function(data, status, headers, config) {
					tweet.message = data.tweet.message;
					tweet.timestamp = data.tweet.timestamp;
					tweet.submitted = true;
					
					console.log('Tweets sucessfully submited');
				})
				.error(function(data, status, headers, config) {
					console.log('There was an error while submiting tweet: ' + data.error);
				});
		};
		Tweets.prototype.loadByUser = function(user, onSuccess, onError) {
			var ctx = this;
			
			$http.get(API_URL + '/users/' + user.username + '/tweets', User.getAPIAuthorizationHeader())
				.success(function(data, status, headers, config) {
					for(var i=0; i<data.tweets.length; i++) {
						var tweet = data.tweets[i];
						tweet.submitted = true;
						tweet.mentions = ctx.parseMentions(tweet.message);
						tweet.hashTags = ctx.parseHashTags(tweet.message);
					}
					
					onSuccess(data.tweets);
				})
				.error(function(data, status, headers, config) {
					console.log('There was an error while loading tweets: ' + data.error);
					
					onError(data.error);
				});
		};

		Tweets.prototype.parseMentions = function(message) {
			var regexResults = message.match(/@([\w\d]+)/g);
			var results = [];
			for(var i in regexResults) {
				results.push(regexResults[i].substr(1));
			}
			return results;
		};
		Tweets.prototype.parseHashTags = function(message) {
			var regexResults = message.match(/#([\w\d]+)/g);
			var results = [];
			for(var i in regexResults) {
				results.push(regexResults[i].substr(1));
			}
			return results;
		};

		return new Tweets();
	}]);
;
