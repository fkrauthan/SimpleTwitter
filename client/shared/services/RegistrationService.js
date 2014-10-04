
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
    register: function(userInfo) {
        return new Promise(function (resolve, reject) {
            var validation = new Validator(userInfo, rules);
            if(validation.fails()) {
                reject(validation.errors.all());
                return;
            }

            var user = {
                'username': userInfo.username,
                'email': userInfo.email,
                'name': userInfo.name,
                'password': userInfo.password
            };

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
