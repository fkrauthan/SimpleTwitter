
var async = require('async');
var sha256 = require(__dirname + '/../../utils/sha256');

module.exports = function(app, sequelize) {
    var User = sequelize.import(__dirname + '/../../models/User');

    app.post('/api/register', function(req, res, next) {
        var user = User.build(req.body);

        async.series([
            function(callback) {
                var errors = user.validate();
                if(errors) {
                    res.status(400).send({
                        'validationErrors': errors
                    });
                    callback(errors);
                    return;
                }

                callback();
            },
            function(callback) {
                User.find({
                    where: {
                        'username': user.username
                    }
                })
                    .success(function (user) {
                        if(user) {
                            res.status(409).send({
                                'validationErrors': {
                                    'username': 'Username already in use!'
                                }
                            });
                            callback(true);
                            return;
                        }
                        callback();
                    }).error(function(error) {
                        next(error);
                        callback(true);
                    });
            },
            function(callback) {
                User.find({
                    where: {
                        'email': user.email
                    }
                })
                    .success(function (user) {
                        if(user) {
                            res.status(409).send({
                                'validationErrors': {
                                    'email': 'Email already in use!'
                                }
                            });
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

            user.password = sha256(user.password);
            user.save()
                .success(function (user) {
                    user = user.toJSON();
                    delete user.password;

                    res.status(201).send(user);
                })
                .error(function (error) {
                    next(error);
                });
        });
    });
};
