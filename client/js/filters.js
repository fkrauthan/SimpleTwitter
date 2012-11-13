'use strict';

angular.module('simpleTwitter.filters', [])
	.filter('timeAgo', ['nowTime', function(now) {
		return function(input) {
			return moment(input).from(now());
		};
	}])
	.filter('tweetMentions', function() {
		return function(input, mentions) {
			for(var i in mentions) {
				var regexString = '@'+mentions[i];
				input = input.replace(new RegExp(regexString, 'g'), '<a class="mention" href="#/u/'+mentions[i]+'">@'+mentions[i]+'</a>');
			}
			return input;
		};
	})
	.filter('tweetHashTags', function() {
		return function(input, hashTags) {
			for(var i in hashTags) {
				var regexString = '#'+hashTags[i];
				input = input.replace(new RegExp(regexString, 'g'), '<a class="hashTag" href="#/c/'+hashTags[i]+'">#'+hashTags[i]+'</a>');
			}
			return input;
		};
	})
;
