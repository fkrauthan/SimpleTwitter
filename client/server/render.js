
var fs = require('fs');
var url = require('url');

var SimpleTwitterApp = require(__dirname + '/../client/components/SimpleTwitterApp.jsx');
var Fluxy = require('fluxy');
var React = require('react');

module.exports = function(CONFIG) {
    var PLACEHOLDER_APP = '<!--app-->';
    var PLACEHOLDER_BOOTSTRAP = '/*bootstrap*/';
    var TEMPLATE = fs.readFileSync(__dirname + '/../client/layout.html', {encoding: 'utf8'});

    return function(req, res, next) {
        var path = url.parse(req.url).pathname;

        Fluxy.start({});
        var content = React.renderComponentToString(SimpleTwitterApp(null));

        res.send(TEMPLATE.replace(PLACEHOLDER_APP, content).replace(PLACEHOLDER_BOOTSTRAP, 'window.__fluxy__ = ' + Fluxy.renderStateToString()));
    };
};
