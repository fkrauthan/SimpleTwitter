
var Fluxy = require('fluxy');

var RegistrationConstants = require('../constants/RegistrationConstants');

var RegistrationService = require('../../shared/services/RegistrationService');

var RegistrationActions = Fluxy.createActions({
    serviceActions: {
        register: [RegistrationConstants.REGISTER_USER, function (user) {
            return RegistrationService.register(user);
        }]
    }
});

module.exports = RegistrationActions;
