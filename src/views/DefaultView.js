const {
  html,
} = require('../utils');
const { Input, Textarea, selectInput, required, maxLength } = require('../components/Input');
const { Div, Meta } = require('../components');

export const DefaultView = props => (state, actions) => {
  console.log(state.inputs);

  return html`
    <Div mt="100px" ml="100px">
      <Meta title="And no.."></Meta>

      Hello world!!!!

      <Input
        mt="40px"
        id="login.name"
        defaultValue="Johnson"
        warn=${e => ([ required, maxLength(10) ])}
        placeholder="hello"></Input>

      Value: ${selectInput(state, 'login.name').value}
      Touched: ${selectInput(state, 'login.name').touched ? 'true' : 'false'}
      Error: ${selectInput(state, 'login.name').error || 'none'}

      <br /><br />

      <Textarea mt="40px" id="login.email" defaultValue="Swanson" placeholder="hello"></Textarea>
      Value: ${selectInput(state, 'login.email').value}
      Touched: ${selectInput(state, 'login.email').touched ? 'true' : 'false'}
      Error: ${selectInput(state, 'login.email').error || 'none'}

            <br /><br />

      ${state.environment.name}
      ${state.environment.online ? '' : 'Your Offline'}
      ${state.environment.browser === 'ie' && state.environment.versionInt < 11 ? 'Your browser is out of date..' : ''}
    </Div>
  `;
}
