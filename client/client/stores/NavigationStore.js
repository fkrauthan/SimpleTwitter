
var NavigationConstants = require('../constants/NavigationConstants');
var Fluxy = require('fluxy');
var $ = Fluxy.$;

var NavigationStore = Fluxy.createStore({
    name: 'NavigationStore',

    getInitialState: function () {
        return {
            path: ''
        }
    },

    actions: [
        [NavigationConstants.PATH_CHANGED, function (newPath) {
            this.set('path', newPath);
        }]
    ]
});
module.exports = NavigationStore;
