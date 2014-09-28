var passport = require('passport');
var prepareUser = require(__dirname + '/../../utils/prepareUser');

module.exports = function(app, sequelize) {
    var User = sequelize.import(__dirname + '/../../models/User');

    function getUser(req, res, next, userId) {
        User.find({
            'where': {
                'id': userId
            }
        }).success(function (result) {
            if(result) {
                res.status(200).send({
                    'user': prepareUser(result)
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

    app.get('/api/users/me', passport.authenticate('token', { session: false }), function(req, res, next) {
        getUser(req, res, next, req.user.id);
    });
    app.get('/api/users/:userId', passport.authenticate('token', { session: false }), function(req, res, next) {
        getUser(req, res, next, req.params.userId);
    });
};