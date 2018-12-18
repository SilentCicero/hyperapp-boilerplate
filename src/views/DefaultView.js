const {
  html,
} = require('../utils');
const { Input } = require('../components/Input');
const { Div, Meta } = require('../components');

const selectInput = (state, form, id) => ((state.inputs[form] || {})[id] || {});

export const DefaultView = props => (state, actions) => {
  console.log(state.inputs);

  return html`
    <Div mt="100px" ml="100px">
      <Meta title="And no.."></Meta>

      Hello world!!!!

      <Input mt="40px" id="login.nick" defaultValue="Johnson" placeholder="hello"></Input>

      Value: ${selectInput(state, 'login', 'nick').value}
      Touched: ${selectInput(state, 'login', 'nick').touched ? 'true' : 'false'}
      Error: ${selectInput(state, 'login', 'nick').error || 'none'}

      ${state.environment.name}
      ${state.environment.online ? '' : 'Your Offline'}
      ${state.environment.browser === 'ie' && state.environment.versionInt < 11 ? 'Your browser is out of date..' : ''}
    </Div>
  `;
}
