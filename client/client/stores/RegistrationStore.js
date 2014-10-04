
var RegistrationConstants = require('../constants/RegistrationConstants');
var Fluxy = require('fluxy');
var $ = Fluxy.$;

var RegistrationStore = Fluxy.createStore({
    name: 'RegistrationStore',

    getInitialState: function () {
        return {
            user: {
                'username': '',
                'email': '',
                'name': '',
                'password': '',
                'password_repeated': ''
            },

            errors: {}
        }
    },

    actions: [
        [RegistrationConstants.REGISTER_USER, function (user) {
            this.set('user', user);
        }],
        [RegistrationConstants.REGISTER_USER_COMPLETED, function (user) {
            console.log('User registered', user);
        }],
        [RegistrationConstants.REGISTER_USER_FAILED, function (errors) {
            for(var key in errors) {
                if(errors[key] instanceof Array) {
                    errors[key] = errors[key].join(' ');
                }
            }

            this.set('errors', errors);
        }]
    ]
});
module.exports = RegistrationStore;
