'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Run Schema
 */
var RunSchema = new Schema({
	distance: Number,
	time: Number,
	//distance_time_series: [],
	provider: String,
	providerId: Number,
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Run', RunSchema);
