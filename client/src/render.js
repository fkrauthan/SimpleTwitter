
var fs = require('fs');
var url = require('url');

module.exports = function(CONFIG) {
    var PLACEHOLDER = '<!-- CONTENT -->';
    var TEMPLATE = fs.readFileSync(__dirname + '/../client/layout.html', {encoding: 'utf8'});

    return function(req, res, next) {
        var path = url.parse(req.url).pathname;

        res.send(TEMPLATE.replace(PLACEHOLDER, path));
    };
};
