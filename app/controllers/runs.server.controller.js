'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Run = mongoose.model('Run'),
	_ = require('lodash'),
	runImport = require('./runs/runs.import');

/**
 * Create a Run
 */
exports.create = function(req, res) {
	var run = new Run(req.body);
	run.user = req.user;

	run.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(run);
		}
	});
};

/**
 * Show the current Run
 */
exports.read = function(req, res) {
	res.jsonp(req.run);
};

/**
 * Update a Run
 */
exports.update = function(req, res) {
	var run = req.run ;

	run = _.extend(run , req.body);

	run.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(run);
		}
	});
};

/**
 * Delete an Run
 */
exports.delete = function(req, res) {
	var run = req.run ;

	run.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(run);
		}
	});
};

/**
 * List of Runs
 */
exports.list = function(req, res) { 
	var query = {};
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	if (startDate) {
		startDate = new Date(startDate);
	}
	if (endDate) {
		endDate = new Date(endDate);
	}
	if (startDate.getTime() && endDate.getTime()) {
		query = {'started_at': {'$gte': startDate.toISOString(), '$lt': endDate.toISOString()}};
	}
	Run.find(query).sort('-started_at').populate('user', 'username').exec(
		function(err, runs) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err),
					raw: err
				});
			} else {
				res.jsonp(runs);
			}
		});
};

// imports any runs created since last sync with provider.
exports.syncUserRuns = function(req, res, next) { 
	var id = req.user._id;
	_.each(req.user.additionalProvidersData, function(value, key, list) {
		if (key === 'mapmyfitness') {
			runImport.importMapMyRuns(req.user, value);
		}
	});
	next();
};

exports.userList = function(req, res) { 
	Run.find({'user': req.user._id}).sort('-created').populate('user', 'username').exec(
		function(err, runs) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(runs);
			}
		});
};

/**
 * Run middleware
 */
exports.runByID = function(req, res, next, id) { Run.findById(id).populate('user', 'displayName').exec(function(err, run) {
		if (err) return next(err);
		if (! run) return next(new Error('Failed to load Run ' + id));
		req.run = run ;
		next();
	});
};

/**
 * Run authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.run.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
