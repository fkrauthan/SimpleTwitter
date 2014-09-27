
var prepareUser = require(__dirname + '/prepareUser');

module.exports = function(tweet) {
    var tweet = tweet.toJSON();
    if(tweet.user !== undefined) {
        tweet.user = prepareUser(tweet.user);
    }

    return tweet;
};
