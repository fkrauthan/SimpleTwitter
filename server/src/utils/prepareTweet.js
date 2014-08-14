
module.exports = function(tweet) {
    var tweet = tweet.toJSON();
    if(tweet.user !== undefined) {
        tweet.user = tweet.user.toJSON();

        delete tweet.user.password;
        delete tweet.user.email;
    }

    return tweet;
};
