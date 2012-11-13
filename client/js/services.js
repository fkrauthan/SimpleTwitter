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
	.factory('User', function($rootScope) {
		var $user = null;

		return {
			'login': function(username, password, rememberMe, onSuccess, onError) {
				//TODO call webservice
				//TODO store rememberMe cookie
				var user = {
					'username': username,
					'fullName': username+' Mustermann',
					'email': username+'@localhost.local',
					'id': '000',
					'token': '1234'
				};

				$user = user;
				$rootScope.$broadcast('login', [$user]);

				onSuccess(true, user);
			},
			'logout': function(callback) {
				//TODO call webservice
				//TODO delete rememberMe Cookie

				$rootScope.$broadcast('logout', [$user]);
				$user = null;

				callback(true);
			},
			'getUser': function() {
				return $user;
			},
			'isLoggedIn': function() {
				return $user!=null;
			}
		};
	})
	.factory('Tweets', ['$rootScope', 'User', function($rootScope, User) {
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

			var tweets = [
				{
					'author': {
						'username': 'fkrauthan',
						'fullName': 'Florian Krauthan'
					},
					'message': 'Hallo Welt 123 das ist mein Tweet mit @fun Und #Hashtag',
					'mentions': [
						'fun'
					],
					'hashTags': [
						'Hashtag'
					],
					'submitted': true,
					'timestamp': new Date('2012-07-17T09:24:17Z')
				},
				{
					'author': {
						'username': 'fkrauthan',
						'fullName': 'Florian Krauthan'
					},
					'message': '2Hallo Welt 123 das ist mein Tweet mit @fun Und #Hashtag',
					'mentions': [
						'fun'
					],
					'hashTags': [
						'Hashtag'
					],
					'submitted': true,
					'timestamp': new Date('2011-07-17T09:24:17Z')
				},
				{
					'author': {
						'username': 'fkrauthan',
						'fullName': 'Florian Krauthan'
					},
					'message': '3Hallo Welt 123 das ist mein Tweet mit @fun Und #Hashtag',
					'mentions': [
						'fun'
					],
					'hashTags': [
						'Hashtag'
					],
					'submitted': true,
					'timestamp': new Date('2010-07-17T09:24:17Z')
				}
			];
			this.add(tweets);

			//TODO call webservice
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
			//TODO call webservice

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
