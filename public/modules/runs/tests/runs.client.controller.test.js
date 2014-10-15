'use strict';

(function() {
	// Runs Controller Spec
	describe('Runs Controller Tests', function() {
		// Initialize global variables
		var RunsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Runs controller.
			RunsController = $controller('RunsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Run object fetched from XHR', inject(function(Runs) {
			// Create sample Run using the Runs service
			var sampleRun = new Runs({
				name: 'New Run'
			});

			// Create a sample Runs array that includes the new Run
			var sampleRuns = [sampleRun];

			// Set GET response
			$httpBackend.expectGET('runs').respond(sampleRuns);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.runs).toEqualData(sampleRuns);
		}));

		it('$scope.findOne() should create an array with one Run object fetched from XHR using a runId URL parameter', inject(function(Runs) {
			// Define a sample Run object
			var sampleRun = new Runs({
				name: 'New Run'
			});

			// Set the URL parameter
			$stateParams.runId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/runs\/([0-9a-fA-F]{24})$/).respond(sampleRun);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.run).toEqualData(sampleRun);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Runs) {
			// Create a sample Run object
			var sampleRunPostData = new Runs({
				name: 'New Run'
			});

			// Create a sample Run response
			var sampleRunResponse = new Runs({
				_id: '525cf20451979dea2c000001',
				name: 'New Run'
			});

			// Fixture mock form input values
			scope.name = 'New Run';

			// Set POST response
			$httpBackend.expectPOST('runs', sampleRunPostData).respond(sampleRunResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Run was created
			expect($location.path()).toBe('/runs/' + sampleRunResponse._id);
		}));

		it('$scope.update() should update a valid Run', inject(function(Runs) {
			// Define a sample Run put data
			var sampleRunPutData = new Runs({
				_id: '525cf20451979dea2c000001',
				name: 'New Run'
			});

			// Mock Run in scope
			scope.run = sampleRunPutData;

			// Set PUT response
			$httpBackend.expectPUT(/runs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/runs/' + sampleRunPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid runId and remove the Run from the scope', inject(function(Runs) {
			// Create new Run object
			var sampleRun = new Runs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Runs array and include the Run
			scope.runs = [sampleRun];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/runs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRun);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.runs.length).toBe(0);
		}));
	});
}());