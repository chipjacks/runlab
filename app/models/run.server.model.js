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
	aggregates: {
		active_time_total: Number,
		distance_total: Number
	},
	time_series: {
		distance: Array 
	},
	created_at: {type: Date},
	updated_at: {type: Date},
	started_at: {type: Date},
	source: String,
	sourceId: Number,
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Run must be associated with user.'
	},
});

RunSchema.virtual('pace').get(function() {
	return this.aggregates.active_time_total / this.aggregate.distance_total;
});

RunSchema.pre('save', function(next) {
  var now = new Date();
	if (!this.updated_at) {
  	this.updated_at = now;
	}
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

mongoose.model('Run', RunSchema);
