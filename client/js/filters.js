'use strict';

angular.module('simpleTwitter.filters', [])
	.filter('timeAgo', ['nowTime', function(now) {
		return function(input) {
			return moment(input).from(now());
		};
	}])
;
