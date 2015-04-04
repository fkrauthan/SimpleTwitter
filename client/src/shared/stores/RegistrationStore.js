import { Store } from 'flummox';

export default class RegistrationStore extends Store {

  constructor(flux) {
      super();

      let navigationActionIds = flux.getActionIds('registration');
      this.register(navigationActionIds.register, this.handleRegistration);
      this.register(navigationActionIds.clearSuccessState, this.handleClearSuccessState);

      this.state = {
          errors: {},
          user: this.createEmptyUser(),
          successful: false
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

  handleClearSuccessState() {
      this.setState({
          errors: {},
          user: this.createEmptyUser(),
          successful: false
      });
  }

  handleRegistration({ user, response }) {
      if(response.errors) {
          this.setState({
              errors: response.errors,
              user: user,
              successful: false
          });
      }

      if(response.success) {
          this.setState({
              errors: {},
              user: this.createEmptyUser(),
              successful: true
          });
      }
  }

  getErrors() {
      return this.state.errors;
  }

  getUser() {
      return this.state.user;
  }

  isSuccessful() {
      return this.state.successful;
  }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(storeStateString) {
        return JSON.parse(storeStateString);
    }

}
