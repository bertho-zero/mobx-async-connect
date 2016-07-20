import { isPromise } from './utils';
import { observer, inject } from 'mobx-react';

/**
 * Wraps react components with store
 * @param asyncItems
 * @return {WrappedComponent}
 */
function wrapWithStore(asyncItems) {
  return asyncItems.map(item => {
    const key = item.key;
    if (!key) {
      return item;
    }

    return {
      ...item,
      promise: options => {
        const { store } = options;
        const next = item.promise(options);

        if (isPromise(next)) {
          store.mobxAsyncConnect.load(key);
          // add action dispatchers
          next.then(
            data => store.mobxAsyncConnect.loadSuccess(key, data),
            err => store.mobxAsyncConnect.loadFail(key, err)
          );
        } else if (next) {
          store.mobxAsyncConnect.loadSuccess(key, next);
        }

        return next;
      }
    };
  });
}

/**
 * Exports decorator, which wraps React components with asyncConnect and connect at the same time
 * @param  {Array} asyncItems
 * @return {Function}
 */
export function asyncConnect(asyncItems) {
  return Component => {
    const asyncStateToProps = store => asyncItems.reduce((result, { key }) => {
      if (!key) {
        return result;
      }

      return {
        ...result,
        [key]: store.mobxAsyncConnect[key]
      };
    }, {});

    const component = inject((store, props) => ({
      ...props,
      ...asyncStateToProps(store)
    }))(observer(Component));

    component.mobxAsyncConnect = wrapWithStore(asyncItems);

    return component;
  };
}
