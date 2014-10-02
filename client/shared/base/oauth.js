
var OAuth = require('OAuth');

module.exports = function(config, userConfig) {
    return function(request) {
        var oauth = new OAuth('#',
            '#',
            config.api.app_token,
            config.api.app_secret,
            '1.0A',
            null,
            'HMAC-SHA1');

        var orderedParams = oauth._prepareParameters(
            userConfig.api.user_token,
            userConfig.api.user_secret,
            request.method,
            request.url
        );

        request.set('Authorization', oauth._buildAuthorizationHeaders(orderedParams));
        return request;
    }
};
