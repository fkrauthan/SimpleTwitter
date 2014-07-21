
module.exports = function(sequelize) {
    var User = sequelize.import(__dirname + '/User');
    var Client = sequelize.import(__dirname + '/Client');
    var AccessToken = sequelize.import(__dirname + '/AccessToken');
    var Tweet = sequelize.import(__dirname + '/Tweet');
    var UserFollow = sequelize.import(__dirname + '/UserFollow');


    //User mappings
    User.hasMany(Tweet, {as: 'Tweets', foreignKey: 'userId'});
    User.hasMany(UserFollow, {as: 'Following', foreignKey: 'userId'});
    User.hasMany(UserFollow, {as: 'Followers', foreignKey: 'followedUserId'});
    User.hasMany(AccessToken, {as: 'AccessTokens', foreignKey: 'userId'});


    //Tweet mappings
    Tweet.belongsTo(User, {foreignKey: 'userId'});


    //UserFollow mappings
    UserFollow.belongsTo(User, {as: 'User', foreignKey: 'userId'});
    UserFollow.belongsTo(User, {as: 'FollowedUser', foreignKey: 'followedUserId'});


    //Client mappings
    Client.hasMany(AccessToken, {as: 'AccessTokens', foreignKey: 'clientId'});


    //AccessToken mappings
    AccessToken.belongsTo(User, {foreignKey: 'userId'});
    AccessToken.belongsTo(Client, {foreignKey: 'clientId'});
}
