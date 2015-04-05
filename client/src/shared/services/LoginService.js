var Validator = require('validatorjs');
var request = require('superagent');
var ApiUtils = require('api-utils');

const rules = {
    username: 'required',
    password: 'required'
};

export default class LoginService {

    static process(credentials) {
        return new Promise(function (resolve, reject) {
            let validation = new Validator(credentials, rules);
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

            request
                .post(ApiUtils.host() + '/api/login')
                .accept('json')
                .type('json')
                .send({
                    username: credentials.username,
                    password: credentials.password,
                    client: 'website',
                    app: 'website'
                })
                .end(function(error, res) {
                    if(error) {
                        resolve(error);
                        return;
                    }

                    if(res.body && res.body.error) {
                        resolve({errors: {
                            username: res.body.error
                        }});
                        return;
                    }

                    resolve({
                        'success': true,
                        'token': res.body.token,
                        'secret': res.body.secret
                    });
                });
        });
    }

}
