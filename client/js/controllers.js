'use strict';


/**
 * Global config
 */
var MAX_MESSAGE_LENGTH = 120;


/**
 * Site elements
 */
function NavbarController($scope, $location) {
	//Handling url changes
	$scope.navClass = function (page) {
		var currentRoute = $location.path().substring(1);
		return page === currentRoute ? 'active' : '';
	};

	//Handling login event
	$scope.$on('login', function(event, args) {
		$scope.isLoggedIn = true;
		$scope.user = args[0];
		$scope.$safeApply($scope);
	});
	$scope.$on('logout', function(event, args) {
		$scope.isLoggedIn = false;
		$scope.user = null;
		$scope.$safeApply($scope);
	});
}
NavbarController.$inject = ['$scope', '$location'];


function TweetSendController($scope, Tweets) {
	$scope.newMessage = '';
	$scope.maxMessageLength = MAX_MESSAGE_LENGTH;

	$scope.sendMessage = function() {
		var msg = $scope.newMessage;
		$scope.newMessage = '';
		Tweets.send(msg);
	};
}
TweetSendController.$inject = ['$scope', 'Tweets'];


/**
 * Site controller
 */
function LoginController($scope, $location, User) {
	$scope.username = '';
	$scope.password = '';
	$scope.rememberMe = false;
	$scope.isLoginError = false;
	
	$scope.doLogin = function() {
		$scope.isLoginError = false;
		$scope.$safeApply($scope);

		//TODO call service to authenticate the user
		User.login($scope.username, $scope.password, $scope.rememberMe, function(user) {
			$location.path('/home');
		}, function(error) {
			$scope.isLoginError = true;
			$scope.$safeApply($scope);
		});
	};
}
LoginController.$inject = ['$scope', '$location', 'User'];


function LogoutController($location, User) {
	User.logout(function() {
		$location.path('/login');
	});
}
LogoutController.$inject = ['$location', 'User'];


function AboutController() {
}
AboutController.$inject = [];


function ErrorController() {
}
ErrorController.$inject = [];


function HomeController($scope, Tweets) {
	$scope.tweets = Tweets.getAll();
	$scope.scrollToTop = function() {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
	};

	//Register event handler
	$scope.$on('tweetsAdded', function() {
		$scope.$safeApply($scope);
	});
	$scope.$on('tweetAdded', function() {
		$scope.$safeApply($scope);
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
				'submitted': true,
				'timestamp': new Date()
			}
		);
	}, 2000);
}
HomeController.$inject = ['$scope', 'Tweets'];