'use strict';

//Runs service used to communicate Runs REST endpoints
angular.module('runs').factory('Runs', ['$resource',
	function($resource) {
		return $resource('runs/:runId', { runId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);