
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
            'password_repeated': ''
        }
    },

    actions: [
        [RegistrationConstants.REGISTER_USER_COMPLETED, function (user) {
            console.log('User registered', user);
        }],
        [RegistrationConstants.REGISTER_USER_FAILED, function (errors) {
            console.log('Validation errors', errors);
        }]
    ]
});
module.exports = RegistrationStore;
