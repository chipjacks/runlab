'use strict';

angular.module('dashboard').directive('calEntry', function() {
	var sumRuns = function(runs) {
		return runs.reduce(function(prevVal, curVal, idx, arr) {
			return prevVal + arr[idx].aggregates.distance_total;
		}, 0);
	};

	var updateSVG = function(svg, runs) {
		var width = 100,
			height = 100,
			radius = Math.min(width, height) / 2;

		svg.attr('width', width)
			.attr('height', height);

		var arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(radius - 20);

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(run) { return run.aggregates.distance_total; }); 

		function paceToColor(run) {
			var pace = moment.duration(6, 'minutes');
			if (pace.asMinutes() <= 4) {
				return 'red';
			} else if (pace.asMinutes() <= 5) {
				return 'orange';
			} else if (pace.asMinutes() <= 6) {
				return 'yellow';
			} else if (pace.asMinutes() <= 7) {
				return 'green';
			} else {
				return 'blue';
			}
		}

		svg.append('g')
				.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
				.selectAll('path')
				.data(pie(runs))
			.enter()
				.append('path')
				.attr('d', arc)
			.style('fill', function(run) { return paceToColor(run); });

		svg.append('text')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
			.attr('dy', '.35em')
			.style('text-anchor', 'middle')
			.text('asd');
	};

	return {
		link: function(scope, elem, attrs) {
			var runs = scope.day.runs;
			var rawSvg = elem.find('svg')[0];
			var svg = d3.select(rawSvg);
			scope.$watch('day', function(newVal, oldVal) {
				if (newVal.runs.length) {
					updateSVG(svg, newVal.runs);
				}
			});
		},
		restrict: 'E',
		templateUrl: 'modules/dashboard/views/cal-entry.html'
	};
});
