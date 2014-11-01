'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	MapMyFitnessStrategy = require('passport-mapmyfitness'),
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	passport.use(new MapMyFitnessStrategy({
			clientID: config.mapmyfitness.clientID,
			clientSecret: config.mapmyfitness.clientSecret,
			callbackURL: config.mapmyfitness.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: providerData.first_name,
				lastName: providerData.last_name,
				displayName: providerData.display_name,
				email: providerData.email,
				username: providerData.username,
				provider: 'mapmyfitness',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};

