
var passport = require('passport');
var prepareUser = require(__dirname + '/../../utils/prepareUser');
var parseBoolean = require(__dirname + '/../../utils/parseBoolean');


module.exports = function(app, sequelize) {
    var User = sequelize.import(__dirname + '/../../models/User');


    app.get('/api/users', passport.authenticate('token', { session: false }), function(req, res, next) {
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

        var where = {};
        if(parseBoolean(req.query.excludeMe, false)) {
            where = {
                'id': {
                    'ne': req.user.id
                }
            };
        }


        User.findAndCountAll({
            'where': where,
            'order': 'username ASC',

            'offset': offset,
            'limit': count
        }).success(function (result) {
            var users = [];
            for(var i in result.rows) {
                users.push(prepareUser(result.rows[i]));
            }

            res.status(200).send({
                'offset': offset,
                'count': count,
                'total': result.count,
                'users': users
            });
        })
            .error(function(error) {
                return next(error);
            });
    });

};
