
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Define schemas
var UserSchema = new Schema({
	username: String,
	email: String,
	password: String,
	name: String,
	registered: { type: Date, default: Date.now }
});

var TweetSchema = new Schema({
	message: String,
	author: {
		userId: {
			type: Schema.Types.ObjectId,
			required: true
		},
		username: String,
		name: String
	},
	timestamp: { type: Date, default: Date.now }
});


//Create models out of schemas
var User = mongoose.model('User', UserSchema);
var Tweet = mongoose.model('Tweet', TweetSchema);


//Handler
UserSchema.pre('save', function(next, done) {
	Tweet.update({author: {userId: this.id}}, {author: {username: this.username, name: this.name}}, {multi: true}, function(err, numberAffected, raw) {
		console.log('[Tweet] The number of updated documents was %d', numberAffected);
		next(err);
	});
});
