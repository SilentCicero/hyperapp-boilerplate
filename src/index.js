const {
  regeneratorRuntime,
  app,
  route,
  assign,
  noop,
  location,
  Route,
  RouterSwitch,
  onLoad,
  isOnline,
  el,
} = require('./utils');
const style = require('./style');
const polyglot = require('./');
const { routes } = require('./routes');
const { detect } = require('detect-browser');
const Input = require('./components/Input');

// APP Starts here..

const state = {
  location: location.state,
  language: 'en',
  inputs: Input.state,
  environment: {
    name: null,
    version: null,
    versionInt: 0,
    os: null,
    online: true,
  },
};

const actions = {
  location: location.actions,
  inputs: Input.actions,
  language: id => () => id,
  environment: {
    change: val => (val),
  },
  load: event => (state, actions) => {
    // detect browser and os
    const browser = detect() || {};
    actions.environment.change({
      name: browser.name,
      version: browser.version,
      versionInt: parseInt((browser.version || '').split('.')[0]),
      os: browser.os,
    });

    // start checking if online
    isOnline(e => actions.environment.change({ online: e }));
  },
};

// main app..
const main = app(state, actions, routes, document.body);

// this is for push state History API in browser..
const unsubscribe = location.subscribe(main.location);

// on window load
const load = onLoad(main.load);
