import { extendObservable, action } from 'mobx';

const initialState = {
  loaded: false,
  loadState: {}
};

export default class MobxAsyncConnectStore {
  constructor(state = initialState) {
    state = Object.assign({}, initialState, state);
    extendObservable(this, state);
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
    this.loadState[key] = {
      loading: true,
      loaded: false
    };
  }

  @action
  loadSuccess(key, data) {
    this.loadState[key] = {
      loading: false,
      loaded: true,
      error: null
    };

    extendObservable(this, {
      [key]: data
    });
  }

  @action
  loadFail(key, error) {
    delete this[key];

    this.loadState[key] = {
      loading: false,
      loaded: false,
      error
    };
  }

  @action
  clearKey(key) {
    delete this[key];

    this.loadState[key] = {
      loading: false,
      loaded: false,
      error: null
    };
  }
}
