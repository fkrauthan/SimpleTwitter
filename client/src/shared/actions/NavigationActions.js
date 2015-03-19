import { Actions } from 'flummox';

export default class NavigationActions extends Actions {
    changePath(newPath) {
        return {
            newPath: newPath
        };
    }
}
