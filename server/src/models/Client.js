
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Client', {
        name: DataTypes.STRING,
        consumerKey: DataTypes.STRING,
        consumerSecret: DataTypes.STRING,
        enabled: DataTypes.BOOLEAN
    });
};
