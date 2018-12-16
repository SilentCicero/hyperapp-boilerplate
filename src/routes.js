const {
  html,
  RouterSwitch,
  Route,
} = require('./utils');
const { DefaultView } = require('./views/DefaultView');
const { NotFound } = require('./views/NotFound');

// routing
export const routes = html`
  <RouterSwitch>
    <Route path="/" render=${DefaultView}></Route>
    <Route path="" render=${NotFound}></Route>
  </RouterSwitch>
`;
