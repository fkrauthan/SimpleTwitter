
function decode(str) {
    return decodeURIComponent(str);
}

function parseHeader(credentials) {
    var params = {}
        , comps = credentials.match(/(\w+)="([^"]+)"/g);

    if (comps) {
        for (var i = 0, len = comps.length; i < len; i++) {
            var comp = /(\w+)="([^"]+)"/.exec(comps[i])
                , name = decode(comp[1])
                , val = decode(comp[2]);

            // Some clients (I'm looking at you request) erroneously add non-protocol
            // params to the `Authorization` header.  This check filters those params
            // out.  It also filters out the `realm` parameter, which is valid to
            // include in the header, but should be excluded for purposes of
            // generating a signature.
            if (name.indexOf('oauth_') == 0) {
                params[name] = val;
            }
        }
    }
    return params;
}

module.exports = function(req) {
    var params;

    if (req.headers && req.headers['authorization']) {
        var parts = req.headers['authorization'].split(' ');
        if (parts.length >= 2) {
            var scheme = parts[0];
            var credentials = null;

            parts.shift();
            credentials = parts.join(' ');

            if (/OAuth/i.test(scheme)) {
                params = parseHeader(credentials);
            }
        } else {
            return null;
        }
    }

    if (req.body && req.body['oauth_signature']) {
        if (params) { return null; }
        params = req.body;
    }

    if (req.query && req.query['oauth_signature']) {
        if (params) { return null; }
        params = req.query;
    }

    if(!params['oauth_token']) {
        return null;
    }

    return params['oauth_token'];
};
