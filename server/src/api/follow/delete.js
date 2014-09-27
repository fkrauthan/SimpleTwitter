
var passport = require('passport');
var Sequelize = require('sequelize');

module.exports = function(app, sequelize) {
    var UserFollow = sequelize.import(__dirname + '/../../models/UserFollow');

    function deleteUserFollow(req, res, next, userId, followedUserId) {
        UserFollow.find({
            'where': {
                'userId': userId,
                'followedUserId': followedUserId
            }
        }).success(function (result) {
            if(!result) {
                return res.status(404).send();
            }

            result.destroy()
                .success(function () {
                    return res.status(204).send();
                }).error(function(error) {
                    next(error);
                });
        })
            .error(function(error) {
                return next(error);
            });
    }

    app.delete('/api/followers/:followedUserId', passport.authenticate('token', { session: false }), function(req, res, next) {
        deleteUserFollow(req, res, next, req.user.id, req.params.followedUserId);
    });
    app.delete('/api/users/:userId/followers/:followedUserId', passport.authenticate('token', { session: false }), function(req, res, next) {
        if(req.params.userId != req.user.id) {
            return res.status(401).send();
        }

        deleteUserFollow(req, res, next, req.params.userId, req.params.followedUserId);
    });
};
