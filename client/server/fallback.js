
var express = require('express');
var router = express.Router();

var RegistrationService = require(__dirname + '/../shared/services/RegistrationService');

module.exports = function(CONFIG) {
    // Execute registration
    router.post('/register', function(req, res, next) {
        RegistrationService.register(req.body)
            .then(function (u) {
                res.redirect('/login');
            }, function(errors) {
                req.stores.RegistrationStore = {
                    'user': req.body,
                    'errors': errors
                };
                next();
            });
    });

    return router;
};
