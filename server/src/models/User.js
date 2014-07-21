
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            validate: {
                is: ['^[a-zA-Z0-9_]+$', 'i'],
                notNull: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [4, 500]
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true,
                isEmail: true
            }
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }
    });
    return User;
};
