
var RegistrationConstants = require('../constants/RegistrationConstants');
var Fluxy = require('fluxy');
var $ = Fluxy.$;

var RegistrationStore = Fluxy.createStore({
    name: 'RegistrationStore',

    getInitialState: function () {
        return {
            'username': '',
            'email': '',
            'name': '',
            'password': '',
            'password_repeat': ''
        }
    }
});
module.exports = RegistrationStore;
