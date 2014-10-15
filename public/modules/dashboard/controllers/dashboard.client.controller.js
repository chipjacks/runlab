'use strict';

angular.module('dashboard').
controller('DashboardController', ['$scope', '$window', 'rundata', function($scope, $window, rundata) {
	var moment = $window.moment;
	// start with last Monday
	$scope.startDay = moment().day(-13); // two weeks ago
	$scope.endDay = moment().day(8); // next Monday
	$scope.weeks = {};
	function updateData() {
		for (var i = $scope.startDay.week(); i <= $scope.endDay.week(); i++) {
			if (!$scope.weeks[i]) {
				initWeek(i);
			}
		}
	}
	function initWeek(weekNum) {
		$scope.weeks[weekNum] = {};
		$scope.weeks[weekNum].days = getDays(weekNum);
		for (var j = 0; j < $scope.weeks[weekNum].days.length; j++) {
			$scope.weeks[weekNum].days[j].runs =
				rundata.getRunsByDate($scope.weeks[weekNum].days[j]);
		}
	}
	$scope.addWeeks = function(amnt) {
		if (amnt < 0) {
			$scope.startDay.add(amnt, 'weeks');
		} else {
			$scope.endDay.add(amnt, 'weeks');
		}
		updateData();
	};
	function getDays(weekNum) {
		var days = [];
		var date = moment().week(weekNum).day(1);
		for (var i = 0; i < 7; i++) {
			days.push(new Date(date));
			date.add(1, 'days');
		}
		return days;
	}
	$scope.sumRuns = function(runs) {
		return runs.reduce(function(prevVal, curVal, idx, arr) {
			return prevVal + arr[idx].distance;
		}, 0);
	};
	$scope.showRuns = function(runs, week) {
		if (!runs.length) {
			return;
		}
		$scope.run = runs[0];
		$scope.weekDetail = week;
	};
	$scope.run = {};
	updateData();
}]);
