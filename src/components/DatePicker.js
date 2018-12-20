const {
  html,
  days,
  years,
  monthNames,
  zeroPad,
  hours,
  minutes,
} = require('../utils');
const { Div } = require('./index');
const { selectInput, Input } = require('./Input');

export const DatePicker = props => (state, actions) => {
  const input = selectInput(state, props.id) || {},
    change = obj => actions.inputs.change({ id: props.id, obj }),
    stage = input.stage || 0;

  return html`
    <Div flex="column">
      <Input p="20px" id=${props.id} placeholder="mm / dd / yy hh:mm"
        onfocus=${e => change({ open: true })} b="1"></Input>
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
          <Div flex="row" align="center" b="1" mt="20px">
            <Div onclick=${e => change({ stage: stage - 1 < 0 ? 0 : stage - 1 })} mr="50px" border="1px solid #F1F1F1" radius="50%">${'<'}</Div>
            <Div>Select a ${[
              'day', 'month', 'year', 'hour', 'minute', 'time'
            ][input.stage || 0]}</Div>
            <Div onclick=${e => change({ stage: stage + 1 > 4 ? 0 : stage + 1 })} ml="50px" border="1px solid #F1F1F1" radius="50%">${'>'}</Div>
          </Div>
          <Div hide=${!input.stage ? '0' : '1'} flex="row" p="12%" wrap="wrap">
            ${days.map(v => html`<Div
              flex="row"
              align="center"
              textAlign="center"
              background=${v == input.day ? 'red' : 'white'}
              onclick=${e => change({ stage: 1, day: v, value: `${zeroPad(v)} / mm / yy` })}
              width="30px" height="30px" pointer="1" hoverBackground="red">
              ${zeroPad(v)}</Div>`)}
          </Div>
          <Div hide=${input.stage === 1 ? '0' : '1'} flex="row" p="10%" wrap="wrap">
            ${monthNames.map((v, i) => html`<Div
              flex="row"
              align="center"
              p="10px"
              background=${i == input.month ? 'red' : 'white'}
              onclick=${e => change({ stage: 2, month: i + 1,
                value: `${zeroPad(input.day)} / ${zeroPad(i + 1)} / yy hh:mm` })}
              textAlign="center" pointer="1" hoverBackground="red">
              ${v}</Div>`)}
          </Div>
          <Div hide=${input.stage === 2 ? '0' : '1'} flex="row" p="10%" wrap="wrap">
            ${years.filter(v => v >= 2018 && v <= 2019).map(v => html`<Div
              flex="row"
              align="center"
              p="10px"
              background=${v == input.year ? 'red' : 'white'}
              onclick=${e => change({ stage: 3, year: v,
                value: `${zeroPad(input.day)} / ${zeroPad(input.month)} / ${String(v).slice(2, 4)} hh:mm` })}
              textAlign="center" pointer="1" hoverBackground="red">
              ${v}</Div>`)}
          </Div>
          <Div hide=${input.stage === 3 ? '0' : '1'} flex="row" p="10%" wrap="wrap">
            ${hours.map(v => html`<Div
              flex="row"
              align="center"
              p="10px"
              background=${v == input.hours ? 'red' : 'white'}
              onclick=${e => change({ stage: 4, hours: v,
                value: `${zeroPad(input.day)} / ${zeroPad(input.month)} / ${String(input.year).slice(2, 4)} ${v}:mm` })}
              textAlign="center" pointer="1" hoverBackground="red">
              ${v}</Div>`)}
          </Div>
          <Div hide=${input.stage === 4 ? '0' : '1'}>
            <Div flex="row" p="10%" wrap="wrap">
              ${minutes.filter(v => v === 0 || v % 5 === 0).map(v => html`<Div
                flex="row"
                align="center"
                p="10px"
                background=${v == input.minutes ? 'red' : 'white'}
                onclick=${e => change({ minutes: zeroPad(v),
                  value: `${zeroPad(input.day)} / ${zeroPad(input.month)} / ${String(input.year).slice(2, 4)} ${input.hours}:${zeroPad(v)}` })}
                textAlign="center" pointer="1" hoverBackground="red">
                ${zeroPad(v)}</Div>`)}
            </Div>
            <Div flex="row" p="10%" wrap="wrap">
              ${['am', 'pm'].map(v => html`<Div
                flex="row"
                align="center"
                p="10px"
                onclick=${e => change({ open: false, stage: 0, ampm: v,
                  value: `${zeroPad(input.day)} / ${zeroPad(input.month)} / ${String(input.year).slice(2, 4)} ${input.hours}:${input.minutes} ${v}` })}
                textAlign="center" pointer="1" hoverBackground="red">
                ${v}</Div>`)}
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  `;
}
