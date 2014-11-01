'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var runs = require('../../app/controllers/runs');

	// Runs Routes
	app.route('/runs')
		.get(runs.list)
		.post(users.requiresLogin, runs.create);

	app.route('/users/:userName/runs')
		.get(runs.syncUserRuns, runs.userList);

	app.route('/runs/:runId')
		.get(runs.read)
		.put(users.requiresLogin, runs.hasAuthorization, runs.update)
		.delete(users.requiresLogin, runs.hasAuthorization, runs.delete);

	// Finish by binding the Run middleware
	app.param('runId', runs.runByID);
	app.param('userName', users.userByUserName);
};
