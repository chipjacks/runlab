'use strict';

//Setting up route
angular.module('runs').config(['$stateProvider',
	function($stateProvider) {
		// Runs state routing
		$stateProvider.
		state('listRuns', {
			url: '/runs',
			templateUrl: 'modules/runs/views/list-runs.client.view.html'
		}).
		state('createRun', {
			url: '/runs/create',
			templateUrl: 'modules/runs/views/create-run.client.view.html'
		}).
		state('viewRun', {
			url: '/runs/:runId',
			templateUrl: 'modules/runs/views/view-run.client.view.html'
		}).
		state('editRun', {
			url: '/runs/:runId/edit',
			templateUrl: 'modules/runs/views/edit-run.client.view.html'
		});
	}
]);
