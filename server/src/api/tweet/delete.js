
var passport = require('passport');


module.exports = function(app, sequelize) {
    var Tweet = sequelize.import(__dirname + '/../../models/Tweet');


    function deleteTweet(req, res, next, userId, tweetId) {
        Tweet.find({
            where: {
                'id': tweetId,
                'userId': userId
            }
        })
            .success(function (tweet) {
                if(!tweet) {
                    return res.status(404).send();
                }

                tweet.destroy()
                    .success(function () {
                        return res.status(204).send();
                    }).error(function(error) {
                        next(error);
                    });
            }).error(function(error) {
                next(error);
            });
    }


    app.delete('/api/tweets/:tweetId', passport.authenticate('token', { session: false }), function(req, res, next) {
        deleteTweet(req, res, next, req.user.id, req.params.tweetId);
    });
    app.delete('/api/users/:userId/tweets/:tweetId', passport.authenticate('token', { session: false }), function(req, res, next) {
        if(req.params.userId != req.user.id) {
            return res.status(401).send();
        }

        deleteTweet(req, res, next, req.params.userId, req.params.tweetId);
    });
};
