'use strict';

angular.module('simpleTwitter', ['simpleTwitter.filters', 'simpleTwitter.services', 'simpleTwitter.directives'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/login', {templateUrl: 'sites/login.html', controller: LoginController});
		$routeProvider.when('/about', {templateUrl: 'sites/about.html', controller: AboutController});
		$routeProvider.otherwise({redirectTo: '/login'});
	}])
	.run(function($rootScope, $location) {
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			//TODO Check for login
			if(next.templateUrl !== 'sites/login.html' && next.templateUrl !== 'sites/about.html') {
				//TODO Check for autlogin
				//TODO save next target
				$location.path('/login');
			}
		});
	})
;
