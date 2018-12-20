const {
  regeneratorRuntime,
  html,
  days,
  months,
  years,
} = require('../utils');
const { Input, SearchInput, Textarea, selectInput, required, maxLength } = require('../components/Input');
const { Div, Meta, Span } = require('../components');

export const DefaultView = props => (state, actions) => {
  return html`
    <Div mt="100px" ml="100px">
      <Meta title="BookThatClass"></Meta>

      Hello world!!!!

      <Input
        mt="40px"
        value="fsdfds"
        id="login.name"
        defaultValue="Johnson"
        validate=${e => [ required ]}
        warn=${e => [ maxLength(10) ]}
        placeholder="hello"></Input>

      <Div flex="row">
        <SearchInput type="number" id="day" strict list=${() => days}></SearchInput>
        <SearchInput type="number" id="month" strict list=${() => months.map(v => v + 1)}></SearchInput>
        <SearchInput type="number" id="year" defaultValue="1992" strict list=${() => years} default="1992"></SearchInput>
      </Div>

      Value: ${selectInput(state, 'login.name').value}
      Touched: ${selectInput(state, 'login.name').touched ? 'true' : 'false'}
      Error: ${selectInput(state, 'login.name').error || 'none'}

      <br /><br />

      <Textarea mt="40px" id="login.email" placeholder="hello"></Textarea>
      Value: ${selectInput(state, 'login.email').value}
      Touched: ${selectInput(state, 'login.email').touched ? 'true' : 'false'}
      Error: ${selectInput(state, 'login.email').error || 'none'}

      <Span background="red" hoverBackground=${'#F1F1F1'} height="20px">dd</Span>

      <button onclick=${e => actions.inputs.validate({
        form: 'login',
        validate: async values => {
          await Promise.resolve('hello');
          return {
            name: values.name.length < 4 ? 'this is too short' : undefined,
          };
        },
        onValid: e => console.log('hello world!!'),
      })}>Validate</button>
      <button onclick=${e => actions.inputs.clearDefault('login')}>Clear</button>

            <br /><br />

      ${state.environment.name}
      ${state.environment.online ? '' : 'Your Offline'}
      ${state.environment.browser === 'ie' && state.environment.versionInt < 11 ? 'Your browser is out of date..' : ''}
    </Div>
  `;
}
