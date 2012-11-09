'use strict';

angular.module('simpleTwitter.services', [])
	.factory('EventDispatcher', function() {
		function EventDispatcher() {
			this.listener = {};
			this.nextId = 0;
		}
		EventDispatcher.prototype.add = function(channel, callback) {
			if(!this.listener[channel]) {
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

		var eventDispatcher = new EventDispatcher();
		return eventDispatcher;
	})
	.factory('User', function(EventDispatcher) {
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
	})
;
