
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	name: String,
	registered: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);
