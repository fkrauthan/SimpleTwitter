
var Fluxy = require('fluxy');

var NavigationConstants = require('../constants/NavigationConstants');

var NavigationActions = Fluxy.createActions({
    changePath: function (newPath) {
        this.dispatchAction(NavigationConstants.PATH_CHANGED, newPath);
    }
});

module.exports = NavigationActions;
