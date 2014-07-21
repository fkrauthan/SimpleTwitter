
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('AccessToken', {
        token: DataTypes.STRING,
        secret: DataTypes.STRING,
        app: DataTypes.STRING,
        revoked: DataTypes.BOOLEAN
    });
};
