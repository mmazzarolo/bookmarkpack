var _ = require('lodash');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var reserved = require('../config/reserved');
var Bookmark = require('./Bookmark');

var userSchema = new mongoose.Schema({
	username: { type: String, unique: true, sparse: true, index: true, lowercase: true },
	email: { type: String, unique: true, index: true, lowercase: true },
	password: String,

	facebook: String,
	twitter: String,
	google: String,
	github: String,
	linkedin: String,
	tokens: Array,

	profile: {
		name: { type: String, default: '' },
		gender: { type: String, default: '' },
		location: { type: String, default: '' },
		website: { type: String, default: '' },
		picture: { type: String, default: '' }
	},

	resetPasswordToken: String,
	resetPasswordExpires: Date,

	bookmarks: [mongoose.model('Bookmark').schema]
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

/**
 * Username validation.
 */
userSchema.path('username').validate(function (username) {
	return !_.contains(reserved.usernames, username);
}, 'Reserved username.');

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size) {
	if (!size) size = 200;
	if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

/**
 * Helper method for checking if the username is available.
 */
userSchema.methods.isUsernameAvailable = function(size) {
	if (!size) size = 200;
	if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

userSchema.plugin(uniqueValidator, {message: 'The {PATH} "{VALUE}" is already in use.'});

module.exports = mongoose.model('User', userSchema);
