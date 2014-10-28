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
	distance_total: Number,
	distance_time_series: [],
	providerName: String,
	providerId: Number,
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Run', RunSchema);
