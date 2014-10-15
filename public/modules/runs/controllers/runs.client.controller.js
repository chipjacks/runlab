'use strict';

// Runs controller
angular.module('runs').controller('RunsController', 
	['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Runs',
	function($scope, $stateParams, $location, $http, Authentication, Runs, Users ) {
		$scope.authentication = Authentication;
		$scope.stateParams = $stateParams;

		// Create new Run
		$scope.create = function() {
			// Create new Run object
			var run = new Runs ({
				name: this.name
			});

			// Redirect after save
			run.$save(function(response) {
				$location.path('runs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Run
		$scope.remove = function( run ) {
			if ( run ) { run.$remove();

				for (var i in $scope.runs ) {
					if ($scope.runs [i] === run ) {
						$scope.runs.splice(i, 1);
					}
				}
			} else {
				$scope.run.$remove(function() {
					$location.path('runs');
				});
			}
		};

		// Update existing Run
		$scope.update = function() {
			var run = $scope.run ;

			run.$update(function() {
				$location.path('runs/' + run._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Runs
		$scope.find = function() {
			$scope.runs = Runs.query();
		};

		// Find a user's runs
		$scope.findUserRuns = function() {
			var username = $stateParams.userName;
			$http.get('/users/' + username + '/runs').
				success(function(runs, status) {
					$scope.runs = runs;
				}).error(function(runs, status) {
					// TODO: add error handling
				});
		};

		// Find existing Run
		$scope.findOne = function() {
			$scope.run = Runs.get({ 
				runId: $stateParams.runId
			});
		};
	}
]);
