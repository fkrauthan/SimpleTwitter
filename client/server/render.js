
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
        if(path == '/favicon.ico' || path == '/apple-touch-icon-precomposed.png' || path == '/apple-touch-icon.png') {
            return next();
        }

        Fluxy.start({
            'NavigationStore': {
                'path': path
            }
        });
        var content = React.renderComponentToString(SimpleTwitterApp(null));

        res.send(TEMPLATE.replace(PLACEHOLDER_APP, content).replace(PLACEHOLDER_BOOTSTRAP, 'window.__fluxy__ = ' + Fluxy.renderStateToString()));
    };
};
