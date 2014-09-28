
var fs = require('fs');
var url = require('url');

var Fluxy = require('fluxy');

module.exports = function(CONFIG) {
    var PLACEHOLDER_APP = '<!--app-->';
    var PLACEHOLDER_BOOTSTRAP = '/*bootstrap*/';
    var TEMPLATE = fs.readFileSync(__dirname + '/../client/layout.html', {encoding: 'utf8'});

    return function(req, res, next) {
        var path = url.parse(req.url).pathname;

        Fluxy.start({});


        res.send(TEMPLATE.replace(PLACEHOLDER_APP, path).replace(PLACEHOLDER_BOOTSTRAP, 'window.__fluxy__ = ' + Fluxy.renderStateToString()));
    };
};
