'use strict';


function NavbarController($scope, $location, EventDispatcher) {
	//Handling url changes
	$scope.navClass = function (page) {
		var currentRoute = $location.path().substring(1);
		return page === currentRoute ? 'active' : '';
	};

	//Handling login event
	EventDispatcher.add('auth.login.success', function(channel, $user) {
		$scope.isLoggedIn = true;
		$scope.user = $user;
	});
	EventDispatcher.add('auth.logout.success', function(channel, $user) {
		$scope.isLoggedIn = false;
		$scope.user = null;
	});
}
NavbarController.$inject = ['$scope', '$location', 'EventDispatcher'];


function LoginController($scope, $location, User) {
	$scope.username = '';
	$scope.password = '';
	$scope.rememberMe = false;
	$scope.isLoginError = false;
	
	$scope.doLogin = function() {
		$scope.isLoginError = false;

		//TODO call service to authenticate the user
		User.login($scope.username, $scope.password, $scope.rememberMe, function(user) {
			$location.path('/home');
		}, function(error) {
			$scope.isLoginError = true;
		});
	};
}
LoginController.$inject = ['$scope', '$location', 'User'];


function LogoutController($location, User) {
	alert('Logout controller');
	User.logout();
	$location.path('/login');
}
LogoutController.$inject = ['$location', 'User'];


function AboutController() {
}
AboutController.$inject = [];


function ErrorController() {
}
ErrorController.$inject = [];


function HomeController($scope, EventDispatcher, Tweets) {
	$scope.tweets = Tweets.getAll();
	EventDispatcher.add('tweet.added', function(channel, $tweet) {
		$scope.tweets.push($tweet);
	});

	setTimeout(function() {
		Tweets.add(
			{
				'author': {
					'username': 'fkrauthan',
					'fullName': 'Florian Krauthan'
				},
				'message': 'NEW Hallo Welt 123 das ist mein Tweet mit @fun Und #Hashtag',
				'mentions': [
					'fun'
				],
				'hashTags': [
					'Hashtag'
				],
				'timestamp': 2352448875
			}
		);
	}, 2000);
}
HomeController.$inject = ['$scope', 'EventDispatcher', 'Tweets'];