
var express = require('express');
var router = express.Router();



module.exports = function(CONFIG) {
    router.post('/register', function(req, res, next) {
        next();
    });

    return router;
};
