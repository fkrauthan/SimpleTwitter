
var prepareUser = require(__dirname + '/prepareUser');

module.exports = function(userFollow) {
    var userFollow = userFollow.toJSON();
    if(userFollow.user !== undefined) {
        userFollow.user = prepareUser(userFollow.user);
    }
    if(userFollow.followedUser !== undefined) {
        userFollow.followedUser = prepareUser(userFollow.followedUser);
    }
    return userFollow;
};
