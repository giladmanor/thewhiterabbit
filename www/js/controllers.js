angular.module('starter.controllers', []).controller('DashCtrl', function($scope, $state, Sessions) {

	console.log(Sessions.is_live());
	if (Sessions.is_live()) {
		$state.go('tab.session');
	}

	$scope.start = function(d) {
		Sessions.start();
		$state.go('tab.session');
	};

	hourgraph(Sessions.getGraphData());

}).controller('SessionLiveCtrl', function($scope, $state, $interval, Sessions) {
	if (!Sessions.is_live()) {
		$state.go('tab.dash');
	}
	$scope.session = Sessions.current();
	$scope.session.tag = "";

	var tick = function() {
		$scope.hours = Math.round((Date.now() - $scope.session.start) / (1000 * 60 * 60));
		$scope.minutes = Math.round((Date.now() - $scope.session.start ) / (1000 * 60) - $scope.hours * 60);
		$scope.seconds = Math.round((Date.now() - $scope.session.start  ) / (1000) - $scope.minutes * 60);
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
