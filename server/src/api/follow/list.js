
var passport = require('passport');
var Sequelize = require('sequelize');
var prepareUserFollow = require(__dirname + '/../../utils/prepareUserFollow');

module.exports = function(app, sequelize) {
    var UserFollow = sequelize.import(__dirname + '/../../models/UserFollow');
    var User = sequelize.import(__dirname + '/../../models/User');

    function listFollowers(req, res, next, userId) {
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

        var followers = true;
        if(req.query.following !== undefined && req.query.following == true) {
            followers = false;
        }

        var includes = [];
        if(followers) {
            includes.push({
                'model': User,
                'as': 'User'
            });
        }
        else {
            includes.push({
                'model': User,
                'as': 'FollowedUser'
            });
        }

        var where = {};
        if(followers) {
            where =  {
                'followedUserId': userId
            };
        }
        else {
            where =  {
                'userId': userId
            };
        }

        UserFollow.findAndCountAll({
            'where': where,
            'order': 'updatedAt DESC',

            'include': includes,

            'offset': offset,
            'limit': count
        }).success(function (result) {
            if(followers) {
                var followers = [];
                for(var i in result.rows) {
                    followers.push(prepareUserFollow(result.rows[i]));
                }

                res.status(200).send({
                    'offset': offset,
                    'count': count,
                    'total': result.count,
                    'followers': followers
                });
            }
            else {
                var following = [];
                for(var i in result.rows) {
                    following.push(prepareUserFollow(result.rows[i]));
                }

                res.status(200).send({
                    'offset': offset,
                    'count': count,
                    'total': result.count,
                    'following': following
                });
            }
        })
        .error(function(error) {
            return next(error);
        });
    }

    app.get('/api/followers', passport.authenticate('token', { session: false }), function(req, res, next) {
        listFollowers(req, res, next, req.user.id);
    });
    app.get('/api/users/:userId/followers', passport.authenticate('token', { session: false }), function(req, res, next) {
        listFollowers(req, res, next, req.params.userId);
    });
};
