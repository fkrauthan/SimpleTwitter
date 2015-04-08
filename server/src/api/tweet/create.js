
var async = require('async');
var passport = require('passport');
var prepareTweet = require(__dirname + '/../../utils/prepareTweet');


module.exports = function(app, sequelize) {
    var Tweet = sequelize.import(__dirname + '/../../models/Tweet');


    function createTweet(req, res, next, userId) {
        var tweet = Tweet.build(req.body);
        tweet.userId = userId;


        var errors = tweet.validate();
        if(errors) {
            return res.status(400).send({
                'validationErrors': errors
            });
        }

        tweet.save()
            .success(function (tweet) {
                res.status(201).send(prepareTweet(tweet));
            })
            .error(function (error) {
                next(error);
            });
    }


    app.post('/api/tweets', passport.authenticate('token', { session: false }), function(req, res, next) {
        createTweet(req, res, next, req.user.id);
    });
    app.post('/api/users/:userId/tweets', passport.authenticate('token', { session: false }), function(req, res, next) {
        if(req.params.userId != req.user.id) {
            return res.status(401).send();
        }

        createTweet(req, res, next, req.params.userId);
    });
};
