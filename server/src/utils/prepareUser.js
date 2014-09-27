
module.exports = function(user) {
    var user = user.toJSON();

    delete user.password;
    delete user.email;

    return user;
};
