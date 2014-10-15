'use strict';

angular.module('dashboard').directive('calEntry', function(rundata) {
	return {
		link: function(scope, elem, attrs) {
			var data = scope.day.runs;
			if (!data.length) {
				return;
			}
			var rawSvg = elem.find('svg')[0];
			var svg = d3.select(rawSvg);
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
				.value(function(d) { return d.distance; }); 

			function paceToColor(run) {
				var pace = rundata.pace(run);
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
					.data(pie(data))
				.enter()
					.append('path')
					.attr('d', arc)
				.style('fill', function(d) { return paceToColor(d.data); });

			svg.append('text')
				.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
				.attr('dy', '.35em')
				.style('text-anchor', 'middle')
				.text(scope.sumRuns(data));
		},
		restrict: 'E',
		templateUrl: 'modules/dashboard/views/cal-entry.html'
	};
});
