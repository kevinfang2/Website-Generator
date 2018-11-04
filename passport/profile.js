
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	password: String,
	isAdmin: Boolean,
	email: String,
	firstName: String,
	lastName: String,
	phoneNumber: Number,
	year: String,
	birthday: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});
