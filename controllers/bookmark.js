var _ = require('lodash');
var S = require('string');
var async = require('async');
var User = require('../models/User');
var Bookmark = require('../models/Bookmark');

var request = require('request');

/**
 * app.param {bookmark}
 */
exports.bookmark = function(req, res, next, id) {
	var bookmark = _.find(req.profile.bookmarks, function(item){
		return item._id == req.params.bookmark;
	});
	if (!bookmark) return res.render('404');
	req.bookmark = bookmark;
	next();
};

/**
 * POST :username/add
 * New bookmark.
 */
exports.postAdd = function(req, res) {
	req.assert('url', 'Invalid URL.').isURL();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('back');
	}

	async.waterfall([
		// Extracting the title from the page
		function(done) {
			request(req.body.url, function (err, response, body) {
		  	var re = new RegExp('<title>(.*?)</title>', 'i');
				var title = body.match(re)[1];
				done(err, title);
			});
		},
		// Adding the new bookmark
		function(title, done) {
			User.findById(req.user.id, function(err, user) {
				if (err) return next(err);
				var name = (S(req.body.name).isEmpty())
					? title
					: req.body.name;
				var bookmark = new Bookmark({
					url: req.body.url,
					name: name,
					title: title,
					hidden: false
				});
				user.bookmarks.push(bookmark);
				user.save(function(err) {
					if (err) return next(err);
					req.flash('success', { msg: 'The bookmark has been added.' });
					return res.redirect('back');
				});
			});
		}
	], function(err) {
		if (err) return next(err);
		res.redirect('/');
	});
};

/**
 * GET :username/:bookmark
 * Edit bookmark.
 */
exports.getEdit = function(req, res) {
	res.render('bookmark', {
		title: 'Edit bookmark',
		bookmark: req.bookmark
	});
};

/**
 * POST :username/:bookmark
 * Edit bookmark.
 */
exports.postEdit = function(req, res) {
	req.assert('url', 'Invalid URL.').isURL();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect(userPath);
	}

	User.findById(req.user._id, function(err, user) {
		bookmark = user.bookmarks.id(req.bookmark._id);
		console.log(bookmark);
		bookmark.name = req.body.name;
		user.save(function(err) {
			if (err) return next(err);
			req.flash('success', { msg: 'The bookmark has been updated.' });
			return res.redirect('back');
		});
	});
};
