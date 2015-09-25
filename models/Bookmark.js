var mongoose = require('mongoose');

var bookmarkSchema = new mongoose.Schema({
	url: String,
	name: String,
	title: String,
	updated: { type: Date, default: Date.now },
	hidden: Boolean 
});

/**
 * Helper method for validating url.
 */
bookmarkSchema.methods.isUrlValid = function(path) {
	var urlRegexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return urlRegexp.test(val);
};

module.exports = mongoose.model('Bookmark', bookmarkSchema);
