
var httpProxy = require('http-proxy');

module.exports = function(CONFIG) {
    var proxy = httpProxy.createProxyServer();

    return function (req, res, next) {
        proxy.web(req, res, { target: CONFIG.api + '/api' });
    };
};
