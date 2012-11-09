'use strict';


function NavbarController() {
}
NavbarController.$inject = [];


function LoginController($scope) {
	$scope.username = '';
	$scope.password = '';
	$scope.rememberMe = false;
	
	$scope.doLogin = function() {
		//TODO call service to authenticate the user
	};
}
LoginController.$inject = ['$scope'];


function AboutController() {
}
AboutController.$inject = [];
