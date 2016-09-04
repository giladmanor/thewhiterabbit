angular.module('starter.controllers', []).controller('DashCtrl', function($scope, $state,$window, Sessions) {

	console.log(Sessions.is_live());
	if (Sessions.is_live()) {
		$state.go('tab.session');
	}

	$scope.start = function(d) {
		Sessions.start();
		$state.go('tab.session');
	};

	hourgraph($window,Sessions.getGraphData());

}).controller('SessionLiveCtrl', function($scope, $state, $interval, Sessions) {
	if (!Sessions.is_live()) {
		$state.go('tab.dash');
	}
	$scope.session = Sessions.current();
	$scope.session.tag = "";

	var pad = function(num, size) {
		var s = "0000" + num;
		return s.substr(s.length - size);
	};
	
	var tick = function() {
		var h = m = s = ms = 0;
		var newTime = '';
		time = Date.now() - $scope.session.start;

		h = Math.floor(time / (60 * 60 * 1000));
		time = time % (60 * 60 * 1000);
		m = Math.floor(time / (60 * 1000));
		time = time % (60 * 1000);
		s = Math.floor(time / 1000);
		ms = time % 1000;

		newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);

		$scope.seconds = pad(s, 2);
		$scope.hours = pad(h, 2);
		$scope.minutes = pad(m, 2);

	};

	$interval(tick, 1000);

	$scope.tags = Sessions.tags();
	console.log("tags", $scope.tags);
	$scope.stop = function(d) {
		tag = ( d ? d.tag : null) || $scope.session.tag;
		Sessions.stop(tag);
		console.log(tag);
		$state.go('tab.dash');
	};
}).controller('TagsCtrl', function($scope, $state, Sessions) {
	$scope.tags = Sessions.sumTags().map(function(t) {
		t.time = Math.round(t.time / (100 * 60 * 60)) / 10;
		return t;
	});
	//$scope.init();
	console.log("!!!!!!!!!!!!");

}).controller('TagDetailCtrl', function($scope, $stateParams, Sessions) {
	$scope.sessions = Sessions.listByTag($stateParams.tag);
	$scope.tag = Sessions.getTag($stateParams.tag);

	$scope.saveColor = function() {
		console.log("save color", $scope.tag);
		Sessions.setTag($scope.tag);
	};

}).controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends : true
	};
});
