
var passport = require('passport');
var uid = require(__dirname + '/../utils/uid');
var parseToken = require(__dirname + '/../utils/parseToken');

module.exports = function(app, sequelize) {
    var Client = sequelize.import(__dirname + '/../models/Client');
    var AccessToken = sequelize.import(__dirname + '/../models/AccessToken');

    app.post(
        '/api/login',
        function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    res.send(401, { error: 'Username or password is wrong!' });
                    return;
                }


                Client.find({
                    where: {
                        'name': req.body.client,
                        'enabled': true
                    }
                }).success(function (client) {
                        if(!client) {
                            res.send(401, { error: 'Can\'t find client!' });
                            return;
                        }

                        AccessToken.find({
                            where: {
                                'userId': user.id,
                                'clientId': client.id,
                                'app': req.body.app
                            }
                        }).success(function (accessToken) {
                                if(accessToken) {
                                    res.send(200, {
                                        'token': accessToken.token,
                                        'secret': accessToken.secret
                                    });
                                }
                                else {
                                    AccessToken.create({
                                        'token': uid(16),
                                        'secret': uid(64),
                                        'app': req.body.app,
                                        'revoked': false,
                                        'userId': user.id,
                                        'clientId': client.id
                                    })
                                        .success(function (accessToken) {
                                            res.send(201, {
                                                'token': accessToken.token,
                                                'secret': accessToken.secret
                                            });
                                        })
                                        .error(function(error) {
                                            return next(err);
                                        });
                                }
                            })
                            .error(function(error) {
                                return next(err);
                            });
                    })
                    .error(function (error) {
                        next(error);
                    });
            })(req, res, next);
        });

    app.delete(
        '/api/revoke',
        passport.authenticate('token', { session: false }),
        function(req, res, next) {
            var accessToken = parseToken(req);

            AccessToken.find({
                where: {
                    'token': accessToken
                }
            }).success(function (accessToken) {
                    accessToken.revoked = true;

                    accessToken.save(['revoked'])
                        .success(function (accessToken) {
                            res.send(200);
                        })
                        .error(function(error) {
                            next(error);
                        });
                })
                .error(function(error) {
                    return next(err);
                });
        });
};
