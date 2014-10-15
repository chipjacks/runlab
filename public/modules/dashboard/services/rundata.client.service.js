'use strict';

angular.module('dashboard').
factory('rundata', function RunDataFactory() {
	var runs = [
		{type: 'jog', date: new Date(2014, 9, 18), distance: 6, time: moment.duration(40, 'm')},
		{type: 'tempo', date: new Date(2014, 9, 18), distance: 6, time: moment.duration(40, 'm')},
		{type: 'jog', date: new Date(2014, 9, 17), distance: 6, time: moment.duration(36, 'm')},
		{type: 'jog', date: new Date(2014, 9, 16), distance: 6, time: moment.duration(40, 'm')},
		{type: 'jog', date: new Date(2014, 10, 5), distance: 8, time: moment.duration(40, 'm')},
		{type: 'workout', date: new Date(2014, 10, 5), distance: 3, time: moment.duration(15, 'm')},
		{type: 'race', date: new Date(2014, 10, 5), distance: 1, time: moment.duration(4, 'm')},
		{type: 'jog', date: new Date(2014, 9, 9), distance: 6, time: moment.duration(40, 'm')},
		{type: 'tempo', date: new Date(2014, 9, 5), distance: 6, time: moment.duration(40, 'm')},
		{type: 'jog', date: new Date(2014, 9, 10), distance: 6, time: moment.duration(36, 'm')},
		{type: 'jog', date: new Date(2014, 9, 12), distance: 6, time: moment.duration(40, 'm')},
		{type: 'jog', date: new Date(2014, 10, 1), distance: 8, time: moment.duration(40, 'm')},
		{type: 'workout', date: new Date(2014, 10, 2), distance: 3, time: moment.duration(15, 'm')},
		{type: 'race', date: new Date(2014, 10, 3), distance: 1, time: moment.duration(4, 'm')}
	];

	function compareDates(date1, date2) {
		return moment(date1).isSame(date2, 'day');
	}

	function getRunsByDate(date) {
		var res = [];
		for (var i = 0; i < runs.length; i++) {
			if (compareDates(runs[i].date, moment(date))) {
				res.push(runs[i]);
			}
		}
		return res;
	}

	function pace(run) {
		return moment.duration(run.time / run.distance);
	}

	return {
		runs: runs,
		getRunsByDate: getRunsByDate,
		pace: pace
	};
});
