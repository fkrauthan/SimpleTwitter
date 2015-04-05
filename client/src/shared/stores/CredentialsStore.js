import { Store } from 'flummox';

export default class CredentialsStore extends Store {

    constructor(flux) {
        super();

        let loginActionIds = flux.getActionIds('login');
        this.register(loginActionIds.login, this.handleLogin);

        this.state = {
            token: '',
            secret: '',
            consumerKey: '',
            consumerSecret: ''
        };
    }

    handleLogin({ credentials, response }) {
        if(response.errors) {
            return;
        }

        this.setState({
            token: response.token,
            secret: response.secret
        });
    }

    setConsumerCredentials({consumerKey, consumerSecret}) {
        this.setState({
            consumerKey,
            consumerSecret
        });
    }

    setCredentials({token, secret}) {
        this.setState({
            token,
            secret
        });
    }

    getCredentials() {
        if(!this.state.token || !this.state.secret) {
            return null;
        }

        return {
            token: this.state.token,
            secret: this.state.secret
        };
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(storeStateString) {
        return JSON.parse(storeStateString);
    }

}
