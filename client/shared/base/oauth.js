
var OAuth = require('OAuth');

function isHost(obj) {
    var str = {}.toString.call(obj);

    switch (str) {
        case '[object File]':
        case '[object Blob]':
        case '[object FormData]':
            return true;
        default:
            return false;
    }
}

module.exports = function(config) {
    return function(request) {
        var oauth = new OAuth('#',
            '#',
            config.app_token,
            config.app_secret,
            '1.0A',
            null,
            'HMAC-SHA1');

        var method = request.method;

        var url = request.url;
        var query = request._query.join('&');
        if (query) {
            query = request.serializeObject(query);
            url += ~url.indexOf('?')
                ? '&' + query
                : '?' + query;
        }

        var data = request._formData || request._data;
        if ('GET' != method && 'HEAD' != method && 'string' != typeof data && !isHost(data)) {
            // serialize stuff
            var serialize = request.serialize[request.getHeader('Content-Type')];
            if (serialize) data = serialize(data);
        }

        var orderedParams = oauth._prepareParameters(
            config.user_token,
            config.user_secret,
            method,
            url,
            data
        );

        request.set('Authorization', oauth._buildAuthorizationHeaders(orderedParams));
        return request;
    }
};
