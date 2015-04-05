import { Actions } from 'flummox';
import LoginService from '../services/LoginService';

export default class LoginActions extends Actions {

    async login(credentials) {
        let response = await LoginService.process(credentials);
        return {
            'response': response,
            'credentials': credentials
        };
    }

}
