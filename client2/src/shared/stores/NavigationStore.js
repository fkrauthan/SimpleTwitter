import { Store } from 'flummox';

export default class NavigationStore extends Store {

  constructor(flux) {
      super();

      let navigationActionIds = flux.getActionIds('navigation');
      this.register(navigationActionIds.changePath, this.handleChangePath);

      this.state = {
          path: '/'
      };
  }

  handleChangePath({ newPath }) {
      this.setState({
          path: newPath
      });
  }

  getPath() {
      return this.state.path;
  }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(storeStateString) {
        return JSON.parse(storeStateString);
    }

}
