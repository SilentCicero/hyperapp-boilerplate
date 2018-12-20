const {
  html,
  days,
  years,
  monthNames,
} = require('../utils');
const { Div } = require('./index');
const { selectInput, Input } = require('./Input');

export const DatePicker = props => (state, actions) => {
  const input = selectInput(state, props.id) || {},
    change = obj => actions.inputs.change({ id: props.id, obj });

  return html`
    <Div flex="column">
      <Input p="20px" id=${props.id} placeholder="mm / dd / yy"
        onfocus=${e => change({ stage: 0, open: true })} b="1"></Input>
      <Div position="relative">
        <Div
          hide=${input.open ? '0' : '1'}
          onclick=${e => change({ open: false })}
          position="fixed" top="0px"
          bottom="0px" right="0px"
          left="0px" index="11000"></Div>
        <Div
          flex="column"
          align="center"
          width="300px" height="300px" background="white" border="1px solid #F1F1F1"
          hide=${input.open ? '0' : '1'} position="absolute" index="14000" >
          <Div b="1" mt="20px">
            Select a day
          </Div>
          <Div hide=${!input.stage ? '0' : '1'} flex="row" p="12%" wrap="wrap">
            ${days.map(v => html`<Div
              flex="row"
              align="center"
              textAlign="center"
              onclick=${e => change({ stage: 1, day: v })}
              width="30px" height="30px" pointer="1" hoverBackground="red">
              ${v}</Div>`)}
          </Div>
          <Div hide=${input.stage === 1 ? '0' : '1'} flex="row" p="10%" wrap="wrap">
            ${monthNames.map((v, i) => html`<Div
              flex="row"
              align="center"
              p="10px"
              onclick=${e => change({ stage: 2, month: i })}
              textAlign="center" pointer="1" hoverBackground="red">
              ${v}</Div>`)}
          </Div>
          <Div hide=${input.stage === 2 ? '0' : '1'} flex="row" p="10%" wrap="wrap">
            ${years.map(v => html`<Div
              flex="row"
              align="center"
              p="10px"
              onclick=${e => change({ open: false, year: v, value: `${input.day}${input.month}${v}` })}
              textAlign="center" pointer="1" hoverBackground="red">
              ${v}</Div>`)}
          </Div>
        </Div>
      </Div>
    </Div>
  `;
}
