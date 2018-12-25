const {
  html,
  days,
  years,
  monthNames,
  zeroPad,
  hours,
  basicMinutes,
  cap,
  daysOfWeek,
  byid,
  assign,
  noop,
  focus,
} = require('../utils');
const { Div, Span } = require('./index');
const { selectInput, Input } = require('./Input');

const defined = v => typeof v !== "undefined";
const int = v => parseInt(v, 10);

const monthOffset = (year, month) => (new Date(input.year || 2018, intMonth, 1)).getDay();
const str = v => String(v);
const lim = (v, limit) => str(v).slice(0, limit);
const lower = v => str(v).toLowerCase();
const onlyNum = (val, charLen = 4) => lim(val, charLen).replace(/\D/g, '');
const intBool = v => v ? '0' : '1';
const Blur = props => html`<Div ${props} position="fixed"
  top="0px" bottom="0px" right="0px" left="0px" index="9000"></Div>`;
const titles = input => ['Select a year', 'Select the month', 'Select the day', 'Select the hour', 'Select the minute', 'Select the time of day'];
const Box = props => html`<Div
  ${assign({}, props, { children: undefined })}
  box="column initial center"
  overflow="hidden"
  position="relative"
  mt="-1px"
  notSelectable
  shadow="0px 3px 15px rgba(0,0,0,0.2)"
  background="white"
  border="1px solid #ccc"
  index="14000"
  p="20px">${props.children}</Div>`;
const Header = props => html`<Div ${props} flex="row" b align="center" justify="center">${props.children}</Div>`;
const noPx = v => str(v).replace('px', '').replace('%', '');
const px = v => `${v}px`;
const InnerBox = props => html`<Div
    flex="row"
    wrap="no-wrap"
    position="absolute"
    pl="inherit" pr="inherit"
    top="80px"
    left=${`-${px(props.stage * props.width)}`}
    transition="all .5s">
    ${props.children}
  </Div>`;
const Content = props => html`<Div
    ${assign({}, props, { children: undefined })}
    wrap="wrap"
    box="row center center">
    ${props.children}
  </Div>`;
const Item = props => html`<Div
    ${assign({}, props, { children: undefined })}
    box="row center center"
    p="10px"
    pointer
    hoverBackground="gray">
    ${props.children}
  </Div>`;
const zeroPad2 = v => defined(v) ? zeroPad(v) : v;
const overlayItem = (props, v) => ({
  onclick: props.goto(v),
  color: props.stage === v && props.input.open ? props.colors.highlight : '',
});
const Overlay = props => html`<Div
    position="absolute"
    ${assign({}, props, { input: undefined })}
    index="10000"
    height="100%"
    width="100%"
    box="row center center"
    cursor="text"
    color=${props.input.open || props.input.touched ? props.colors.dark : props.colors.light}
    bottom="0px"
    right="0px"
    left="0px">
    <Div ${overlayItem(props, 0)}>${props.getData(0) || 'yyyy'}</Div>
    <Div ${overlayItem(props, 1)}>-${zeroPad2(props.getData(1)) || 'mm'}</Div>
    <Div ${overlayItem(props, 2)}>-${zeroPad2(props.getData(2)) || 'dd'}</Div>
    <Div flex="row" ml="20px">
      <Div ${overlayItem(props, 3)}>${props.getData(3) || 'hh'}</Div>
      :<Div ${overlayItem(props, 4)}>${zeroPad2(props.getData(4)) || 'mm'}</Div>
      <Div  ${overlayItem(props, 5)}>${props.getData(5) || (props.stage === 4 || props.stage === 5 ? '--' : '')}</Div>
    </Div>
  </Div>`;
const TAB_KEY = 9;
const ENTER_KEY = 13;
const constrainInt = (v, len, min = 0, max, num = onlyNum(v === '' ? 0 : v, len)) => {
  return (num < min) ? undefined : (num > max ? max : num);
};
const constrain = stage => [
  year => constrainInt(year, 4, 1900, 2030),
  month => constrainInt(month, 2, 1, 12),
  day => constrainInt(day, 2, 1, 31),
  hour => constrainInt(hour, 2, 1, 12),
  minute => constrainInt(minute, 2, 0, 59),
  ampm => (lower(ampm) !== 'am' && lower(ampm) !== 'pm') ? 'pm' : ampm,
][stage];
const buildDate = i => new Date(i[0] || 1900, int(i[1] || 1) - 1, i[2] || 1, i[3] || 1, i[4] || 0);

export const DatePicker = props => (state, actions) => {
  const input = selectInput(state, props.id) || {},
    change = obj => actions.inputs.change({ id: props.id, obj }),
    stage = input.stage,
    completed = input.completed || 0,
    current = buildDate(input),
    colors = assign({}, props.colors || { highlight: 'salmon', light: 'lightgray', dark: 'gray' }),
    getData = stg => (stg === stage ? input.value : undefined) || (input || {})[stg],
    width = int(noPx(props.boxWidth)) || 300,
    height = int(noPx(props.boxHeight)) || 300,
    onfocus = e => change({ stage: stage || 0, open: true }),
    goto = (stg, nStg = (stg > 5 ? 0 : stg)) => e => {
      if (input[stg - 1 < 0 ? 0 : stg - 1] && nStg <= completed + 1)
        change({ stage: nStg, completed: (stg <= completed ? completed : stg), value: '' });
    },
    oninput = e => change({
      value: (stage === 5 ? lim : onlyNum)(e.target.value, stage === 0 ? 4 : 2),
      [stage]: constrain(stage)(e.target.value) }),
    onkeydown = e => {
      if (e.keyCode === TAB_KEY || e.keyCode === ENTER_KEY)
        noop(goto(stage + 1)(), stage < 5 ? e.preventDefault() : null);
    };

  return html`
    <Div flex="column">
      <Div flex="column" position="relative" width="100%">
        <Input ${assign(props, { onfocus, onkeydown, oninput })} color="rgba(0,0,0,0)"></Input>
        <Overlay ${{ input, stage, colors, goto, getData, onclick: e => focus(props.id) }}></Overlay>
      </Div>
      <Blur hide=${intBool(input.open)} onclick=${e => change({ open: false })}></Blur>
      <Box hide=${intBool(input.open)} width=${px(width)} height=${px(height)} onclick=${e => focus(props.id)}>
        ${current.toISOString()}
        <Header>${(props.titles || titles)(input)[stage] || ''}</Header>
        <InnerBox ${{ stage, width }}>
          <Content ${{ width: px(width) }}>Years</Content>
          <Content ${{ width: px(width) }}>Months</Content>
          <Content ${{ width: px(width) }}>Date</Content>
          <Content ${{ width: px(width) }}>Hours</Content>
          <Content ${{ width: px(width) }}>Minutes</Content>
        </InnerBox>
      </Box>
    </Div>
  `;
}

export const DatePicker2 = props => (state, actions) => {
  const input = selectInput(state, props.id) || {},
    change = obj => actions.inputs.change({ id: props.id, obj }),
    completed = input.completed || 0,
    stage = input.stage === 0 ? 0 : (input.stage || -1),
    current = (new Date()),
    intMonth = input.month ? parseInt(input.month || 0) - 1 : 0,
    firstDay = (new Date(input.year || 2018, intMonth, 1)).getDay(),
    inputDate = (new Date(input.year, intMonth, input.day)),
    fullDate = input.year && input.month && input.day ?
      `${cap(daysOfWeek[inputDate.getDay()])}, ${input.day} ${monthNames[intMonth].slice(0, 3)} ${String(input.year).slice(2, 4)}'` : 'yyyy-mm-dd',
    highlight = 'salmon',
    Content = props => html`<Div
      position="absolute"
      transition="all .5s"
      wrap="wrap"
      flex="row" ${props}>${props.children}</Div>`,
    next = v => v > completed ? completed : v,
    limit = (v, lim) => String(v).slice(0, lim);

  return html`
    <Div flex="column" position="relative">
      <Input p="20px" id=${props.id}
        index=${input.open ? '10000' : '13000'}
        oninput=${e => {
          if (stage === 0) change({ year: limit(e.target.value, 4), value: limit(e.target.value, 4) });
          if (stage === 1) change({ month: parseInt(limit(e.target.value, 2), 10) - 1, value: limit(e.target.value, 2) });
          if (stage === 2) change({ day: limit(e.target.value, 2), value: limit(e.target.value, 2) });
          if (stage === 3) change({ hours: limit(e.target.value, 2), value: limit(e.target.value, 2) });
          if (stage === 4) change({ minutes: limit(e.target.value, 2), value: limit(e.target.value, 2) });
          if (stage === 5) change({ ampm: limit(e.target.value, 2), value: limit(e.target.value, 2) });
        }}
        onkeydown=${e => {
          if (e.keyCode === 9) {
            change({ stage: input.value ? ((stage + 1) > 5 ? 5 : stage + 1) : stage, open: stage === 5 ? false : true, value: '' });
            if (stage < 5) e.preventDefault();
          }
          if (e.keyCode === 13) {
            change({ stage: input.value ? ((stage + 1) > 5 ? 5 : stage + 1) : stage, open: stage === 5 ? false : true, value: '' });
            if (stage < 5) e.preventDefault();
          }
        }}
        onfocus=${e => change({ stage: stage >= 0 ? stage : 0, open: true })} opacity="0" color="#FFF"></Input>
      <Div position="absolute" p="20px" top="0px"
        border="1px solid #ccc"
        index=${input.open ? '13000' : '10000'}
        color=${input.touched ? '' : 'gray'}
        flex="row"
        bottom="0px" right="0px" left="0px" justify="center">
        ${input.open ? html`<Div flex="row" textAlign="center" b="1">
          <Span color=${stage === 0 && input.open ? highlight : ''} onclick=${e => change({ stage: next(0) })}>${defined(input.year) ? String(input.year) : 'yyyy'}</Span>
          <Span color=${stage === 1 && input.open ? highlight : ''} onclick=${e => change({ stage: next(1) })}>-${defined(input.month) ? zeroPad(int(input.month) + 1) : 'mm'}</Span>
          <Span color=${stage === 2 && input.open ? highlight : ''} onclick=${e => change({ stage: next(2) })}>-${defined(input.day) ? zeroPad(input.day) : 'dd'}</Span>
        </Div>` : html`<Span b="1">${fullDate}</Span>`}>
        ${props.noTime ? '' : html`<Span flex="row" ml="15px" b="1">
          <Span color=${stage === 3 && input.open ? highlight : ''} onclick=${e => change({ stage: next(3) })}>${defined(input.hours) ? zeroPad(input.hours) : 'hh'}</Span>
          :<Span color=${stage === 4 && input.open ? highlight : ''} onclick=${e => change({ stage: next(4) })}>${defined(input.minutes) ? zeroPad(input.minutes) : 'mm'}</Span>
          <Span color=${stage === 5 && input.open ? highlight : ''} onclick=${e => change({ stage: next(5) })}>${input.ampm ? input.ampm : ''}</Span>
        </Span>`}
      </Div>
      <Div position="relative">
        <Div
          hide=${input.open ? '0' : '1'}
          onclick=${e => change({ stage: stage >= 5 ? 0 : stage, ampm: stage >= 4 ? (input.ampm || 'am') : input.ampm, open: false })}
          position="fixed"
          top="0px"
          bottom="0px"
          right="0px"
          left="0px"
          index="9000"></Div>
        <Div
          flex="column"
          align="center"
          overflow="hidden"
          height="300px"
          width="100%"
          shadow="0px 3px 15px rgba(0,0,0,0.2)"
          top="-1px"
          background="white"
          border="1px solid #ccc"
          hide=${input.open ? '0' : '1'} position="absolute" index="14000" p="20px">
          <Div flex="row" width="100%" justify="center" align="center" b="1">
            <Div b="1">${stage === 2 ? monthNames[intMonth] : `${[
              'Select a year', 'Select a month', 'Select a date', 'Select the hour', 'Select the minute', 'Select the time of day'
            ][(stage < 0 ? 0 : stage) || 0]}`}</Div>
          </Div>

          <Div notSelectable position="relative" mt="20px" height="100%" width="100%">
            <Div
              position="absolute"
              transition="all .5s"
              height="100%"
              width="100%"
              wrap="wrap"
              flex="row"
              justify="center"
              align="center"
              left=${stage === -1 ? '100%' : (stage === 0 ? '0px' : '-100%')}>
              ${years.filter(v => v >= 2018 && v <= 2020).map(v => html`<Div
                flex="row"
                align="center"
                p="10px"
                justify="center"
                background=${v == input.year ? 'salmon' : (current.getFullYear() === v ? '#F1F1F1' : 'white')}
                onclick=${e => change({ completed: input.completed > 1 ? input.completed : 1, stage: 1, year: v })}
                pointer="1" hoverBackground="gray">${v}</Div>`)}
            </Div>
            <Div
              position="absolute"
              transition="all .5s"
              height="100%"
              width="100%"
              wrap="wrap"
              flex="row"
              top=${stage >= 0 && stage <= 2 ? '0px' : '1500px'}
              left=${stage === 0 ? '120%' : (stage === 1 ? '0px' : '-120%')}>
              ${monthNames.map((v, i) => html`<Div
                flex="row"
                width="33%"
                align="center"
                justify="center"
                background=${i == input.month ? 'salmon' : (current.getMonth() === i ? '#F1F1F1' : 'white')}
                onclick=${e => change({ completed: input.completed > 2 ? input.completed : 2, stage: 2, month: i })}
                textAlign="center" pointer="1" hoverBackground="gray">${v}</Div>`)}
            </Div>
            <Div
              position="absolute"
              transition="all .5s"
              height="100%"
              width="70%"
              ml="15%"
              mr="15%"
              flex="row"
              wrap="wrap"
              top=${stage >= 1 && stage <= 3 ? '0px' : '1500px'}
              left=${stage === 1 ? '120%' : (stage === 2 ? '0px' : '-120%')}>
              ${['su', 'mo','tu','we','th','fr','sa'].map(v => html`<Div
                flex="row"
                justify="center"
                align="center"
                textAlign="center"
                width="30px" height="30px">
                ${cap(v)}</Div>`)}
              ${Array(firstDay).fill(0).map(v => html`<Div width="30px" height="30px"></Div>`)}
              ${days.map(v => html`<Div
                flex="row"
                align="center"
                justify="center"
                background=${v == input.day ? 'salmon' : (parseInt(input.month) - 1 == current.getMonth() && current.getDate() === v ? '#F1F1F1' : 'white')}
                onclick=${e => change({  completed: input.completed > 3 ? input.completed : 3, stage: 3, day: v })}
                width="30px" height="30px" pointer="1" hoverBackground="gray">${zeroPad(v)}</Div>`)}
            </Div>
            <Div
              position="absolute"
              transition="all .5s"
              height="60%"
              width="70%"
              ml="15%"
              mr="15%"
              pt="20px"
              wrap="wrap"
              flex="row"
              top=${stage >= 2 && stage <= 4 ? '0px' : '1500px'}
              left=${stage === 2 ? '120%' : (stage === 3 ? '0px' : '-120%')}>
              ${hours.map(v => html`<Div
                flex="row"
                align="center"
                p="10px"
                justify="center"
                width="20px" height="20px"
                background=${v == input.hours ? 'salmon' : 'white'}
                onclick=${e => change({ completed: input.completed > 4 ? input.completed : 4, stage: 4, hours: v })}
                pointer="1" hoverBackground="gray">${v}</Div>`)}
            </Div>
            <Div
              position="absolute"
              transition="all .5s"
              height="100%"
              width="80%"
              ml="10%"
              mr="10%"
              pt="0px"
              wrap="wrap"
              flex="row"
              top=${(stage >= 3 && stage <= 5 || stage === 0) ? '0px' : '1500px'}
              left=${stage === 3 ? '120%' : ((stage === 4 || stage === 5) ? '0px' : '-120%')}>
              <Div flex="row" p="10%" pb="0px" wrap="wrap">
                ${basicMinutes.filter(v => v === 0 || v % 5 === 0).map(v => html`<Div
                  flex="row"
                  align="center"
                  p="10px"
                  justify="center"
                  background=${v == input.minutes ? 'salmon' : 'white'}
                  onclick=${e => change({ completed: input.completed > 5 ? input.completed : 5, open: input.ampm ? false : true, stage: 5, minutes: zeroPad(v) })}
                  textAlign="center" pointer="1" hoverBackground="gray">${zeroPad(v)}</Div>`)}
              </Div>
              <Div flex="row" align="center" p="10%" pt="10px" justify="center" wrap="wrap">
                ${['am', 'pm'].map(v => html`<Div
                  flex="row"
                  align="center"
                  p="10px"
                  justify="center"
                  background=${v == input.ampm ? 'salmon' : 'white'}
                  onclick=${e => change({ open: input.minutes ? false : true, stage: input.minutes ? 0 : 5, ampm: v })}
                  textAlign="center" pointer="1" hoverBackground="gray">${v}</Div>`)}
            </Div>
          </Div>

        </Div>
      </Div>
    </Div>
  `;
}
