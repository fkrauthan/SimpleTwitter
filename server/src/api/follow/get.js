
var passport = require('passport');
var Sequelize = require('sequelize');
var prepareUserFollow = require(__dirname + '/../../utils/prepareUserFollow');

module.exports = function(app, sequelize) {
    var UserFollow = sequelize.import(__dirname + '/../../models/UserFollow');
    var User = sequelize.import(__dirname + '/../../models/User');

    function getFollower(req, res, next, userId, followedUserId) {
        UserFollow.find({
            'where': {
                'userId': userId,
                'followedUserId': followedUserId
            },

            'include': [{
                'model': User,
                'as': 'FollowedUser'
            }]
        }).success(function (result) {
            if(result) {
                res.status(200).send({
                    'followedUser': prepareUserFollow(result)
                });
            }
            else {
                res.status(404).send();
            }
        })
            .error(function(error) {
                return next(error);
            });
    }

    app.get('/api/followers/:followedUserId', passport.authenticate('token', { session: false }), function(req, res, next) {
        getFollower(req, res, next, req.user.id, req.params.followedUserId);
    });
    app.get('/api/users/:userId/followers/:followedUserId', passport.authenticate('token', { session: false }), function(req, res, next) {
        getFollower(req, res, next, req.params.userId, req.params.followedUserId);
    });
};
