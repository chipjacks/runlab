'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	RunKeeperStrategy = require('passport-runkeeper').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	passport.use(new RunKeeperStrategy({
			clientID: config.runkeeper.clientID,
			clientSecret: config.runkeeper.clientSecret,
			callbackURL: config.runkeeper.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.id = profile.id;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			var names = profile.name.split(' ');
			var firstname = names[0];
			var lastname = '';
			if (names.length > 1) {
				lastname = names[names.length - 1];
			}
			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: firstname,
				lastName: lastname,
				displayName: profile.name,
				provider: 'runkeeper',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};
