
var passport = require('passport');
var prepareTweet = require(__dirname + '/../../utils/prepareTweet');


module.exports = function(app, sequelize) {
    var Tweet = sequelize.import(__dirname + '/../../models/Tweet');
    var User = sequelize.import(__dirname + '/../../models/User');


    function listTweets(req, res, next, userId) {
        var count = req.query.count;
        if(count === undefined) {
            count = 20;
        }
        else if(count > 100) {
            count = 100;
        }

        var offset = req.query.offset;
        if(offset === undefined) {
            offset = 0;
        }

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

        Tweet.findAndCountAll({
            'where': {
                'userId': userId
            },
            'order': 'updatedAt DESC',

            'include': includes,

            'offset': offset,
            'limit': count
        }).success(function (result) {
                var tweets = [];
                for(var i in result.rows) {
                    tweets.push(prepareTweet(result.rows[i]));
                }

                res.status(200).send({
                    'offset': offset,
                    'count': count,
                    'total': result.count,
                    'tweets': tweets
                });
            })
            .error(function(error) {
                return next(error);
            });
    }


    app.get('/api/tweets', passport.authenticate('token', { session: false }), function(req, res, next) {
        listTweets(req, res, next, req.user.id);
    });
    app.get('/api/users/:userId/tweets', passport.authenticate('token', { session: false }), function(req, res, next) {
        listTweets(req, res, next, req.params.userId);
    });
};
