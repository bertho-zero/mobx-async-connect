# mobx-async-connect
How do you usually request data and store it to mobx store?
You create actions that do async jobs to load data, create store to save this data to mobx state,
then connect data to your component or container.

Usually it's very similar routine tasks.

Also, usually we want data to be preloaded. Especially if you're building universal app,
or you just want pages to be solid, don't jump when data was loaded.

This package consist of 2 parts: one part allows you to delay containers rendering until some async actions are happening.
Another stores your data to mobx store and connect your loaded data to your container.

## Notice

This is a fork, merge and refactor of [redux-async-connect](https://github.com/Rezonans/redux-async-connect) and [redux-connect](https://github.com/makeomatic/redux-connect) for Mobx.

## Installation & Usage

Using [npm](https://www.npmjs.com/):

`$ npm install mobx-async-connect -S`

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { browserHistory, Router, Route } from 'react-router';
import { MobxAsyncConnect, asyncConnect, store as mobxAsyncConnect } from 'mobx-async-connect';

// 1. Connect your data, similar to mobx-react @inject
@asyncConnect([{
  key: 'lunch',
  promise: ({ store, location, params }) => Promise.resolve({ id: 1, name: 'Borsch' })
}])
class App extends React.Component {
  render() {
    // 2. access data as props
    const lunch = this.props.lunch
    return (
      <div>{lunch.name}</div>
    );
  }
}

// 3. Connect mobx async store
const initialState = window.__data || null;
const store = {
  mobxAsyncConnect: new mobxAsyncConnect(initialState && initialState.mobxAsyncConnect || undefined)
};

// 4. Render `Router` with MobxAsyncConnect middleware
render((
  <Provider {...store}>
    <Router render={props => <MobxAsyncConnect {...props} filter={item => !item.deferred} />} history={browserHistory}>
      <Route path="/" component={App}/>
    </Router>
  </Provider>
), el);
```

### Server

```js
import { renderToString } from 'react-dom/server';
import { match } from 'react-router';
import { Provider } from 'mobx-react';
import { MobxAsyncConnect, loadOnServer, store as mobxAsyncConnect } from 'mobx-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import serialize from 'serialize-javascript';

app.get('*', (req, res) => {
  const store = {
    mobxAsyncConnect: new mobxAsyncConnect()
  };

  match({ history, routes, location: req.url }, (err, redirect, renderProps) => {

    // 1. load data
    loadOnServer({ ...renderProps, store }).then(() => {

      // 2. use `MobxAsyncConnect` instead of `RouterContext` and pass it `renderProps`
      const appHTML = renderToString(
        <Provider {...store}>
          <MobxAsyncConnect {...renderProps} />
        </Provider>
      );

      // 3. render the Mobx initial data into the server markup
      const html = createPage(appHTML, store);
      res.send(html);
    });
  });
});

function createPage(html, store) {
  return `
    <!doctype html>
    <html>
      <body>
        <div id="app">${html}</div>

        <!-- its a Mobx initial data -->
        <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store)};`}} charSet="UTF-8"/>
      </body>
    </html>
  `;
}
```

## API


By default `render` props of the `MobxAsyncConnect` component is:

```js
const render = props => <RouterContext {...props} />;
```

##

All additionnals 'parameters' (eg: helpers, data fetcher) added to props of `MobxAsyncConnect` component(s) are accessible in promise options, beside `store`, `location`, `params` and others.

Note: For universal application it is highly recommended to have the same client-side props than server side.

## Contributors
- [Kévin Berthommier](https://github.com/bertho-zero)

## Collaboration
You're welcome to PR, and we appreciate any questions or issues, please [open an issue](https://github.com/bertho-zero/mobx-async-connect/issues)!