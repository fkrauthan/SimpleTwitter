
var passport = require('passport');
var Sequelize = require('sequelize');
var async = require('async');
var prepareUserFollow = require(__dirname + '/../../utils/prepareUserFollow');

module.exports = function(app, sequelize) {
    var UserFollow = sequelize.import(__dirname + '/../../models/UserFollow');

    function addUserFollow(req, res, next, userId, followedUserId) {
        var userFollow = UserFollow.build({
            'userId': userId,
            'followedUserId': followedUserId
        });

        async.series([
            function(callback) {
                var errors = userFollow.validate();
                if(errors) {
                    res.send(400, {
                        'validationErrors': errors
                    });
                    callback(errors);
                    return;
                }

                callback();
            },
            function(callback) {
                UserFollow.find({
                    'where': {
                        'userId': userId,
                        'followedUserId': followedUserId
                    }
                })
                    .success(function (result) {
                        if(result) {
                            res.status(200).send();
                            callback(true);
                            return;
                        }
                        callback();
                    }).error(function(error) {
                        next(error);
                        callback(true);
                    });
            }
        ], function(err, results) {
            if(err) {
                return;
            }

            userFollow.save()
                .success(function (result) {
                    res.status(201).send();
                })
                .error(function (error) {
                    next(error);
                });
        });
    }

    app.post('/api/followers', passport.authenticate('token', { session: false }), function(req, res, next) {
        addUserFollow(req, res, next, req.user.id, req.body.followedUserId);
    });
    app.post('/api/users/:userId/followers', passport.authenticate('token', { session: false }), function(req, res, next) {
        if(req.params.userId != req.user.id) {
            return res.status(401).send();
        }

        addUserFollow(req, res, next, req.params.userId, req.body.followedUserId);
    });

    app.post('/api/followers/:followedUserId', passport.authenticate('token', { session: false }), function(req, res, next) {
        addUserFollow(req, res, next, req.user.id, req.params.followedUserId);
    });
    app.post('/api/users/:userId/followers/:followedUserId', passport.authenticate('token', { session: false }), function(req, res, next) {
        if(req.params.userId != req.user.id) {
            return res.status(401).send();
        }

        addUserFollow(req, res, next, req.params.userId, req.params.followedUserId);
    });
};
