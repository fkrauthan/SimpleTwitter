'use strict';

angular.module('simpleTwitter.directives', [])
	.directive('tweetLength', function() {
		return function(scope, element, attrs) {
			var maxLength = attrs.maxLength;
			if(!angular.isNumber(maxLength)) {
				maxLength = scope[maxLength];
			}
			scope.$watch(attrs.tweetLength, function(value) {
				if(value && value.length > maxLength) {
					scope[attrs.tweetLength] = value.substr(0, maxLength);
				}
				scope[attrs.tweetLength+'CharsLeft'] = maxLength - value.length;
			});
			scope[attrs.tweetLength+'CharsLeft'] = maxLength;
		};
	})
;
