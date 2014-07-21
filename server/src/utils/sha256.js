
var crypto = require('crypto');

module.exports = function(string) {
    return crypto.createHash('sha256').update(string).digest('base64');
};
