const {
  html,
} = require('../utils');
const { Div, Meta } = require('../components');

export const DefaultView = props => (state, actions) => {
  return html`
    <Div mt="100px" ml="100px">
      <Meta
        title="Default Yes"
        description="some description.."></Meta>

      Hello world!!!!

      ${state.environment.name}
      ${state.environment.online ? '' : 'Your Offline'}
      ${state.environment.browser === 'ie' && state.environment.versionInt < 11 ? 'Your browser is out of date..' : ''}
    </Div>
  `;
}
