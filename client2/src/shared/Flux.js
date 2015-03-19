import { Flummox } from 'flummox';

import NavigationActions from './actions/NavigationActions';
import NavigationStore from './stores/NavigationStore';

import RegistrationActions from './actions/RegistrationActions';
import RegistrationStore from './stores/RegistrationStore';


export default class Flux extends Flummox {
    constructor() {
        super();

        this.createActions('navigation', NavigationActions);
        this.createStore('navigation', NavigationStore, this);

        this.createActions('registration', RegistrationActions);
        this.createStore('registration', RegistrationStore, this);
    }
}
