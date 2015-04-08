
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
                    res.status(401).send({ error: 'Username or password is wrong!' });
                    return;
                }


                Client.find({
                    where: {
                        'name': req.body.client,
                        'enabled': true
                    }
                }).success(function (client) {
                        if(!client) {
                            res.status(401).send({ error: 'Can\'t find client!' });
                            return;
                        }

                        AccessToken.find({
                            where: {
                                'userId': user.id,
                                'clientId': client.id,
                                'app': req.body.app,
                                'revoked': false
                            }
                        }).success(function (accessToken) {
                                if(accessToken) {
                                    res.status(200).send({
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
                                            res.status(201).send({
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
                            res.status(200).send();
                        })
                        .error(function(error) {
                            next(error);
                        });
                })
                .error(function(error) {
                    return next(error);
                });
        });
};
