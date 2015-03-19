import { Actions } from 'flummox';
import RegistrationService from '../services/RegistrationService';

export default class RegistrationsActions extends Actions {

    async register(user) {
        let response = await RegistrationService.process(user);
        return {
            'response': response,
            'user': user
        };
    }

}
