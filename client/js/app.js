'use strict';

angular.module('simpleTwitter', ['simpleTwitter.filters', 'simpleTwitter.services', 'simpleTwitter.directives', 'ngSanitize'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('', {redirectTo: '/login'})
			.when('/', {redirectTo: '/login'})

			.when('/login', {templateUrl: 'sites/login.html', controller: LoginController})
			.when('/logout', {templateUrl: 'sites/logout.html', controller: LogoutController})

			.when('/about', {templateUrl: 'sites/about.html', controller: AboutController})
			.when('/404', {templateUrl: 'sites/404.html', controller: ErrorController})

			.when('/home', {templateUrl: 'sites/home.html', controller: HomeController})
			.otherwise({redirectTo: '/404'})
		;
	}])
	.run(function($rootScope, $location, User) {
		var allowedUrls = [
			'sites/login.html',
			'sites/about.html',
			'sites/404.html'
		];
		function inArray(item, array) {
			for(var i=0; i<array.length; i++) {
				if(array[i] === item) {
					return true;
				}
			}
			return false;
		}

		$rootScope.$safeApply = function($scope, fn) {
			$scope = $scope || $rootScope;
			fn = fn || function() {};
			if($scope.$$phase) {
				fn();
			}
			else {
				$scope.$apply(fn);
			}
		};

		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			if(!User.isLoggedIn()) {
				if(!inArray(next.templateUrl, allowedUrls)) {
					//TODO Check for autlogin
					//TODO save next target
					$location.path('/login');
				}
			}
			else {
				if(next.templateUrl === 'sites/login.html') {
					$location.path('/home');
				}
			}
		});
	})
;
