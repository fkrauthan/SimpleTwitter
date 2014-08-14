
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Tweet', {
        message: {
            type: DataTypes.TEXT,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [0, 140]
            }
        }
    });
};
