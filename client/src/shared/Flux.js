import { Flummox } from 'flummox';

import NavigationActions from './actions/NavigationActions';
import NavigationStore from './stores/NavigationStore';

import RegistrationActions from './actions/RegistrationActions';
import RegistrationStore from './stores/RegistrationStore';

import LoginActions from './actions/LoginActions';
import LoginStore from './stores/LoginStore';

import CredentialsStore from './stores/CredentialsStore';


export default class Flux extends Flummox {
    constructor() {
        super();

        this.createActions('navigation', NavigationActions);
        this.createStore('navigation', NavigationStore, this);

        this.createActions('registration', RegistrationActions);
        this.createStore('registration', RegistrationStore, this);

        this.createActions('login', LoginActions);
        this.createStore('login', LoginStore, this);

        this.createStore('credentials', CredentialsStore, this);
    }
}
