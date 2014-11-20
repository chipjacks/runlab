'use strict';

angular.module('dashboard').
controller('DashboardController', ['$scope', '$window', 'Runs', function($scope, $window, Runs) {
	var moment = $window.moment;
	// start with last Monday
	$scope.startDay = moment().day(-13).hour(0).minute(0).second(0); // Monday two weeks ago
	$scope.endDay = moment().day(8).hour(0).minute(0).second(0); // next Monday
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
			var today = moment($scope.weeks[weekNum].days[j]);
			var tomorrow = new Date(today.add(1, 'days')).toISOString();
			today = new Date(today.subtract(1, 'days')).toISOString();
			$scope.weeks[weekNum].days[j].runs =
				Runs.query({
					startDate: today,
					endDate: tomorrow
				});
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
			return prevVal + arr[idx].aggregates.distance_total;
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
