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
	$scope.registrationEnabled = REGISTRATION_ENABLED;

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
	$scope.signinInProgress = false;
	
	$scope.doLogin = function() {
		$scope.isLoginError = false;
		$scope.signinInProgress = true;
		$scope.$safeApply($scope);

		User.login($scope.username, $scope.password, $scope.rememberMe, function(user) {
			$scope.signinInProgress = false;
			$location.path('/home');
		}, function(error) {
			$scope.signinInProgress = false;
			$scope.isLoginError = true;
			$scope.$safeApply($scope);
		});
	};
}
LoginController.$inject = ['$scope', '$location', 'User'];

/**
 * Site controller
 */
function RegisterController($scope, $location, User) {
	$scope.user = {
		'username' : '',
		'email': '',
		'name': '',
		'password': '',
		'passwordRepeated': ''
	};
	$scope.errorMessage = '';
	$scope.signupInProgress = false;
	
	$scope.doSignUp = function() {
		if($scope.user.password != $scope.user.passwordRepeated) {
			$scope.errorMessage = 'The password\'s do not match!';
		}
		else {
			$scope.errorMessage = '';
			$scope.signupInProgress = true;
			
			User.register({
				'username': $scope.user.username,
				'email': $scope.user.email,
				'name': $scope.user.name,
				'password': $scope.user.password
			}, function() {
				$scope.signupInProgress = false;
				
				$scope.user = {
					'username' : '',
					'email': '',
					'name': '',
					'password': '',
					'passwordRepeated': ''
				};
				
				alert('Your registration was successful. You can sign in to your account.');
				$location.path('/login');
			}, function(err) {
				$scope.signupInProgress = false;
				
				$scope.errorMessage = err;
				$scope.$safeApply($scope);
			});		
		}
	};
}
RegisterController.$inject = ['$scope', '$location', 'User'];


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
}
HomeController.$inject = ['$scope', 'Tweets'];


function UsersController($scope, Users) {
	$scope.users = Users.getAll();
	
	$scope.follow = function(user) {
		if(user._processing) {
			return;
		}
		
		user._follow = true;
		user._processing = true;
		
		Users.follow(user, function() {
			user._processing = false;
		}, function(err) {
			user._follow = false;
			user._processing = false;
			alert('There was an error while following a user');
		});
	};
	$scope.unfollow = function(user) {
		if(user._processing) {
			return;
		}
		
		user._follow = false;
		user._processing = true;
		
		Users.unfollow(user, function() {
			user._processing = false;
		}, function(err) {
			user._follow = true;
			user._processing = false;
			alert('There was an error while unfollowing a user');
		});
	};
}
UsersController.$inject = ['$scope', 'Users'];
