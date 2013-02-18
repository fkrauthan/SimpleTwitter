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
		}
		Tweets.prototype.load = function() {
			this.init = true;

			var ctx = this;
			$http.get(API_URL + '/users/' + User.getUsername() + '/tweets', User.getAPIAuthorizationHeader())
				.success(function(data, status, headers, config) {
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
				'timestamp': new Date()
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
