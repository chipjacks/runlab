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

var saveRun = function(user, runData, provider, providerId) {
	Run.findOne({'user': user._id, 'provider': provider, 'providerId': providerId}).exec(
		function(err, run) {
			if (err) {
				console.log('Error finding run.');
				return;
			} else if (!run) {
				// no run found, create one
				run = new Run({
					'user': user._id,
					'provider': provider,
					'providerId': providerId,
				});
			}
			// update properties
			run.date = runData.start_datetime;
			run.time = runData.aggregates.active_time_total;
			run.distance = runData.aggregates.distance_total;
			run.save();
		});
};

exports.importMapMyRuns = function(user, providerData) {
	var query = { 
		'user': providerData.id,
		'activity_type': '/v7.0/activity_type/16/',
	};
// 	if (providerData.last_import) {
// 		query.updated_after = providerData.last_import;
// 	}
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
// 	console.log(url.format(options));

	var callback = function(res) {
// 		console.log('Got response: ' + res.statusCode);
		var str = '';
		var runs;
		//another chunk of data has been recieved, so append it to `str`
		res.on('data', function (chunk) {
			if (chunk) str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		res.on('end', function () {
			runs = JSON.parse(str);
			var run;
			_.forEach(runs._embedded.workouts, function (wo) {
				saveRun(user, wo, 'mapmyfitness', wo._links.self.id);
			});
		});
	};
	
	var req = https.get(options, callback);
	req.on('error', function(e) {
		console.log('Caught error: ' + e.message);
	});
	req.end();
};

