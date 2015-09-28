var mongoose = require('mongoose');
var request = require('request');

var bookmarkSchema = new mongoose.Schema({
	url: String,
	name: String,
	title: { type: String, default: '' },
	updated: { type: Date, default: Date.now },
	hidden: Boolean
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
