
var Validator = require('validatorjs');
var request = require('superagent');
var ApiUtils = require('api-utils');

const rules = {
    name: 'required',
    username: 'required',
    email: 'required|email',
    password: 'required|min:5|same:password_repeated',
    password_repeated: 'required'
};

function map_validation_errors(errors) {
    return {errors};
}

export default class RegistrationService {

    static process(userInfo) {
        return new Promise(function (resolve, reject) {
            let validation = new Validator(userInfo, rules, {
                'same.password': 'The password and password repeated fields must match.',
                'required.password_repeated': 'The password repeated field is required.'
            });

            if(validation.fails()) {
                let errors = validation.errors.all();
                for(var key in errors) {
                    if(errors[key] instanceof Array) {
                        errors[key] = errors[key].join(' ');
                    }
                }

                resolve({errors});
                return;
            }

            let user = {
                'username': userInfo.username,
                'email': userInfo.email,
                'name': userInfo.name,
                'password': userInfo.password
            };

            request
                .post(ApiUtils.host() + '/api/register')
                .accept('json')
                .type('json')
                .send(user)
                .end(function(error, res) {
                    if(error) {
                        resolve(error);
                        return;
                    }

                    if(res.body && res.body.validationErrors) {
                        resolve(map_validation_errors(res.body.validationErrors));
                        return;
                    }

                    resolve({'success': true});
                });
        });
    }

}
