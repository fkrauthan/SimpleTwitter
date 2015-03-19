import { Store } from 'flummox';

export default class RegistrationStore extends Store {

  constructor(flux) {
      super();

      let navigationActionIds = flux.getActionIds('registration');
      this.register(navigationActionIds.register, this.handleRegistration);

      this.state = {
          errors: {},
          user: this.createEmptyUser()
      };
  }

  createEmptyUser() {
      return {
          username: '',
          email: '',
          name: '',
          password: '',
          password_repeated: ''
      };
  }

  handleRegistration({ user, response }) {
      if(response.errors) {
          this.setState({
              errors: response.errors,
              user: user
          });
      }

      //TODO handle api errors / successful registration
      //console.log(user, response);
      /*this.setState({
          path: newPath
      });*/
  }

  getErrors() {
      return this.state.errors;
  }

  getUser() {
      return this.state.user;
  }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(storeStateString) {
        return JSON.parse(storeStateString);
    }

}
