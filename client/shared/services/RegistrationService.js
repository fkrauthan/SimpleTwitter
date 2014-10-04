
var Promise = require('promise');
var Validator = require('validatorjs');
var request = require('superagent');


var rules = {
    name: 'required',
    username: 'required',
    email: 'required|email',
    password: 'required|min:5|same:password_repeat',
    password_repeat: 'required'
};


var RegistrationService = {
    register: function(user) {
        return new Promise(function (resolve, reject) {
            var validation = new Validator(user, rules);
            if(validation.fails()) {
                reject(validation.errors.all());
                return;
            }

            delete user.password_repeat;

            request
                .post('/register')
                .accept('json')
                .type('json')
                .send(user)
                .end(function(error, res) {
                    if(error) {
                        reject(error);
                        return;
                    }

                    resolve(res);
                });
        });
    }
};
module.exports = RegistrationService;
