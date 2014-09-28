
module.exports = function(app, sequelize) {
    require(__dirname + '/register')(app, sequelize);
    require(__dirname + '/list')(app, sequelize);
    require(__dirname + '/get')(app, sequelize);
};
