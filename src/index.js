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
} = require('./utils');
const style = require('./style');
const { routes } = require('./routes');
const { detect } = require('detect-browser');

// APP Starts here..

const state = {
  location: location.state,
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
  environment: {
    change: val => (val),
  },
  load: event => (state, actions) => {
    const browser = detect() || {};
    actions.environment.change({
      name: browser.name,
      version: browser.version,
      versionInt: parseInt((browser.version || '').split('.')[0]),
      os: browser.os,
    });
    isOnline(e => actions.environment.change({ online: e }));
  },
};

// main app..
const main = app(state, actions, routes, document.body);

// this is for push state History API in browser..
const unsubscribe = location.subscribe(main.location);

// on window load
const load = onLoad(main.load);
