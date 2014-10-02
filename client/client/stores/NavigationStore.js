
var NavigationConstants = require('../constants/NavigationConstants');
var Fluxy = require('fluxy');
var $ = Fluxy.$;

var NavigationStore = Fluxy.createStore({
    name: 'NavigationStore',

    getInitialState: function () {
        return {
            url: ''
        }
    }
});
module.exports = NavigationStore;
