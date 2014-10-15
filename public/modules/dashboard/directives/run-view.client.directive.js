'use strict';

angular.module('dashboard').directive('runView', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/dashboard/views/run-view.html'
	};
});
