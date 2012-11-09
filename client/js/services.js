'use strict';

angular.module('simpleTwitter.services', [])
	.factory('EventDispatcher', function() {
		function EventDispatcher() {
			this.listener = {};
			this.nextId = 0;
		}
		EventDispatcher.prototype.add = function(channel, callback) {
			if(typeof this.listener[channel] === 'undefined') {
				this.listener[channel] = {};
			}
			var id = this.nextId;
			this.nextId += 1;
			this.listener[channel][id] = callback;

			return id;
		};
		EventDispatcher.prototype.remove = function(channel, id) {
			if(!this.listener[channel]) {
				return null;
			}
			else if(this.listener[channel][id]) {
				return null;
			}
			var clb = this.listener[channel][id];
			delete this.listener[channel][id];

			return clb;
		};
		EventDispatcher.prototype.emit = function(channel, data) {
			if(!this.listener[channel]) {
				return null;
			}

			var count = 0;
			for(var key in this.listener[channel]) {
				count += 1;
				this.listener[channel][key](channel, data);
			}

			return count;
		};

		return new EventDispatcher();
	})
	.factory('User', ['EventDispatcher', function(EventDispatcher) {
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
				EventDispatcher.emit('auth.login.success', $user);

				onSuccess(true, user);
			},
			'logout': function(callback) {
				//TODO call webservice
				//TODO delete rememberMe Cookie

				EventDispatcher.emit('auth.logout.success', $user);
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
	}])
	.factory('Tweets', ['EventDispatcher', function(EventDispatcher) {
		function Tweets() {
			this.tweets = [];
			this.init = false;

			var ctx = this;
			EventDispatcher.add('auth.login.success', function(channel, $user) {
				alert('Load Data');
				ctx.load();
			});
			EventDispatcher.add('auth.logout.success', function(channel, $user) {
				ctx.tweets = [];
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
					'timestamp': 1352448873
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
					'timestamp': 1352448875
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
					'timestamp': 1352448890
				}
			];
			this.add(tweets);

			//TODO call webservice
		};
		Tweets.prototype.add = function(data) {
			if(data instanceof Array) {
				for(var i=0; i<data.length; i++) {
					this.tweets.push(data[i]);
					EventDispatcher.emit('tweet.added', data[i]);
				}
			}
			else {
				this.tweets.push(data);
				EventDispatcher.emit('tweet.added', data);
			}
		};
		Tweets.prototype.getAll = function() {
			if(!this.init) {
				this.load();
			}
			return this.tweets;
		}

		return new Tweets();
	}]);
;
