
module.exports = function(app, sequelize) {
    require(__dirname + '/list')(app, sequelize);
    require(__dirname + '/get')(app, sequelize);
    require(__dirname + '/add')(app, sequelize);
    require(__dirname + '/delete')(app, sequelize);
};
