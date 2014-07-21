
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Tweet', {
        message: DataTypes.TEXT
    });
};
