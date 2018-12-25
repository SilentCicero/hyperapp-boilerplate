const {
  regeneratorRuntime,
  html,
  days,
  months,
  years,
  minutes,
  hours,
  monthNames,
} = require('../utils');
const { Input, SearchInput, Textarea, selectInput, required, maxLength } = require('../components/Input');
const { Div, Meta, Span } = require('../components');
const { DatePicker } = require('../components/DatePicker');

export const DefaultView = props => (state, actions) => {
  return html`
    <Div mt="100px" ml="100px">
      <Meta title="BookThatClass"></Meta>

      Registration Opens:
      <Div width="300px">
        <DatePicker id="dateTime" p="20px"></DatePicker>
      </Div>
    </Div>
  `;
}

/*

      <Input
        mt="40px"
        value="fsdfds"
        id="login.name"
        defaultValue="Johnson"
        validate=${e => [ required ]}
        warn=${e => [ maxLength(10) ]}
        placeholder="hello"></Input>

        <br /><br />

          <h3>Date</h3>

      <Div flex="row" align="center" border="1px solid lightgray;">
        <SearchInput next="month" min="0" border="0px" p="15px" width="30px" type="number" id="year" placeholder="yyyy" strict list=${() => years}></SearchInput>
        <SearchInput next="day" min="0" border="0px" p="15px" width="30px" options=${{ width: '200px' }} type="number" id="month" placeholder="mm"
          option=${v => `${v} ${monthNames[v - 1]}`}
          strict list=${() => months.map(v => v + 1)}></SearchInput>
        <SearchInput next="minutes" min="0" border="0px" p="15px" width="30px" type="number" id="day" placeholder="dd" strict list=${() => days}></SearchInput>
        <SearchInput next="hours" min="0" border="0px" p="15px" width="30px" type="number" id="minutes" placeholder="hh" strict list=${() => hours}></SearchInput>
        :
        <SearchInput min="0" border="0px" p="15px" width="30px" type="number" id="hours" placeholder="mm" strict list=${() => minutes}></SearchInput>
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
      ${state.environment.browser === 'ie' && state.environment.versionInt < 11 ? 'Your browser is out of date..' : ''}*/
