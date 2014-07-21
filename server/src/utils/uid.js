
var crypto = require('crypto');

module.exports = function(len) {
    var buf = crypto.randomBytes(len/2+1);
    return buf.toString('hex').substr(0, len);
};
