import { Store } from 'flummox';

export default class LoginStore extends Store {

    constructor(flux) {
        super();

        let loginActionIds = flux.getActionIds('login');
        this.register(loginActionIds.login, this.handleLogin);

        this.state = {
            errors: {},
            username: '',
            password: ''
        };
    }

    handleLogin({ credentials, response }) {
        if(response.errors) {
            this.setState({
                errors: response.errors,
                username: credentials.username,
                password: credentials.password
            });
        }
    }

    static serialize(state) {
        var stateCopy = Object.assign({}, state);
        stateCopy.password = '';

        return JSON.stringify(stateCopy);
    }

    static deserialize(storeStateString) {
        return JSON.parse(storeStateString);
    }

}
