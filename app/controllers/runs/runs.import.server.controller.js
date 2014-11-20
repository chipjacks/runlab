'use strict';

var https = require('https'),
	url = require('url'),
	qs = require('querystring'),
	config = require('../../../config/config'),
	mongoose = require('mongoose'),
	Run = mongoose.model('Run'),
	_ = require('lodash');

// MapMyRun:
// { start_datetime: '2014-10-09T07:00:00+00:00',
//   name: 'Ran 10.00 mi on 10/9/14',
//   updated_datetime: '2014-10-13T04:31:47+00:00',
//   created_datetime: '2014-10-13T04:31:47+00:00',
//   notes: '',
//   reference_key: '1412838000',
//   start_locale_timezone: 'America/Chicago',
//   source: 'MapMyRun iPhone',
//   _links:
//    { self: [ [Object] ],
//      activity_type: [ [Object] ],
//      user: [ [Object] ],
//      privacy: [ [Object] ] },
//   has_time_series: false,
//   is_verified: true,
//   aggregates:
//    { active_time_total: 4200,
//      elapsed_time_total: 4200,
//      distance_total: 16093.44,
//      speed_avg: 3.8317720672,
//      metabolic_energy_total: 4288600 } }

var saveRun = function(user, inRun) {
	console.log(inRun.sourceId);
	var query = {
		'user': user._id,
		'source': inRun.source,
		'sourceId': inRun.sourceId
	};
	Run.findOne(query).exec(
		function(err, run) {
			if (err) {
				console.log('Error finding run.');
				return;
			} else {
				run = new Run(inRun);
				run.user = user._id;
				run.save(function (err) {
					if (err) {
						console.log(err.message);
					}
				});
			}
		});
};

var mapMyRunAdapter = function(inRun) {
	var outRun = {};
	outRun.source = 'mapmyrun';
	outRun.sourceId = inRun._links.self[0].id;
	outRun.updated_at = new Date(inRun.updated_datetime);
	outRun.started_at = new Date(inRun.start_datetime);
	outRun.aggregates = {};
	outRun.aggregates.active_time_total = inRun.aggregates.active_time_total;
	outRun.aggregates.distance_total = inRun.aggregates.distance_total;
	if (inRun.time_series) {
		outRun.time_series = {};
		outRun.time_series.distance = inRun.time_series.distance;
	}

	return outRun;
};

exports.importMapMyRuns = function(user, providerData) {
	var query = { 
		'user': providerData.id,
		'activity_type': '/v7.0/activity_type/16/',
		'limit': 20,
		'offset': 0
	};
 	if (providerData.last_import) {
 		query.updated_after = providerData.last_import;
 	}
	var options = {
		protocol: 'https:',
		host: 'oauth2-api.mapmyapi.com',
		path: '/v7.0/workout/?' + qs.stringify(query),
 		headers: {
 			'Api-Key': config.mapmyfitness.clientID,
 			'Authorization': 'Bearer ' + providerData.accessToken,
 			'Content-Type': 'application/json'
 		}
	};

// 	console.log(options.headers);
//  	console.log(url.format(options));
//  	console.log(options.path);
			
	var allRunsCallback = function(res) {
		var str = '';
		var runs;
		res.on('data', function (chunk) {
			if (chunk) str += chunk;
		});

		res.on('end', function () {
			runs = JSON.parse(str);
			//console.log(str);
			var run;
			if (runs.total_count > query.offset + query.limit) {
				query.offset += 20;
				options.path = '/v7.0/workout/?' + qs.stringify(query);
				var req = https.get(options, allRunsCallback);
				req.on('error', function(e) {
					console.log('Caught error: ' + e.message);
				});
				req.end();
			}

			_.forEach(runs._embedded.workouts, function (wo) {
				if (wo.has_time_series) {
					options.path = '/v7.0/workout/' + wo._links.self[0].id + '/?field_set=time_series';
					var req = https.get(options, singleRunCallback);
					req.on('error', function(e) {
						console.log('Caught error: ' + e.message);
					});
					req.end();
				} else {
					saveRun(user, mapMyRunAdapter(wo));
				}
			});
			var now = new Date();
			providerData.last_import = now.toISOString();
			user.markModified('additionalProvidersData.mapmyfitness.last_import');
			user.save();
		});
	};

	var singleRunCallback = function(res) {
		var str = '';
		res.on('data', function (chunk) {
			if (chunk) str += chunk;
		});

		res.on('end', function () {
			var run = JSON.parse(str);
			saveRun(user, mapMyRunAdapter(run));
		});
	};

	
	var req = https.get(options, allRunsCallback);
	req.on('error', function(e) {
		console.log('Caught error: ' + e.message);
	});
	req.end();
};

