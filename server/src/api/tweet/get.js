
var passport = require('passport');
var prepareTweet = require(__dirname + '/../../utils/prepareTweet');


module.exports = function(app, sequelize) {
    var Tweet = sequelize.import(__dirname + '/../../models/Tweet');
    var User = sequelize.import(__dirname + '/../../models/User');


    function getTweet(req, res, next, userId, tweetId) {
        var includeUser = req.query.includeUser;
        if(includeUser === undefined) {
            includeUser = true;
        }
        else if(includeUser == true || includeUser == 1 || includeUser == 'true') {
            includeUser = true;
        }
        else {
            includeUser = false;
        }


        var includes = [];
        if(includeUser) {
            includes.push({
                'model': User
            });
        }

        Tweet.find({
            where: {
                'id': tweetId,
                'userId': userId
            },

            'include': includes
        })
            .success(function (tweet) {
                if(!tweet) {
                    return res.status(404).send();
                }

                res.status(200).send(prepareTweet(tweet));
            }).error(function(error) {
                next(error);
            });
    }


    app.get('/api/tweets/:tweetId', passport.authenticate('token', { session: false }), function(req, res, next) {
        getTweet(req, res, next, req.user.id, req.params.tweetId);
    });
    app.get('/api/users/:userId/tweets/:tweetId', passport.authenticate('token', { session: false }), function(req, res, next) {
        getTweet(req, res, next, req.params.userId, req.params.tweetId);
    });
};
