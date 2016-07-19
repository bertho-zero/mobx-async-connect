import { observable, action } from 'mobx';

const initialState = {
  loaded: false,
  loadState: {}
};

export default class MobxAsyncConnectStore {
  @observable loaded = false;
  @observable loadState = {};

  constructor(state = initialState) {
    state = Object.assign({}, initialState, state);
    this.loaded = state.loaded;
    this.loadState = state.loadState;
  }

  @action
  beginGlobalLoad() {
    this.loaded = false;
  }

  @action
  endGlobalLoad() {
    this.loaded = true;
  }

  @action
  load(key) {
    this.loadState = {
      ...this.loadState,
      [key]: {
        loading: true,
        loaded: false
      }
    };
  }

  @action
  loadSuccess(key, data) {
    this.loadState = {
      ...this.loadState,
      [key]: {
        loading: false,
        loaded: true,
        error: null,
        result: data
      }
    };
  }

  @action
  loadFail(key, error) {
    delete this.loadState[key].result;

    this.loadState = {
      ...this.loadState,
      [key]: {
        loading: false,
        loaded: false,
        error
      }
    };
  }

  @action
  clearKey(key) {
    delete this.loadState[key].result;

    this.loadState = {
      ...this.loadState,
      [key]: {
        loading: false,
        loaded: false,
        error: null
      }
    };
  }
}
