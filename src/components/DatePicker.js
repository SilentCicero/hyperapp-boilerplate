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
  styled,
} = require('../utils');
const { Div, Span } = require('./index');
const { selectInput, Input } = require('./Input');

const defined = v => typeof v !== "undefined";
const int = v => parseInt(noPx(v), 10);
const monthOffset = (year, month) => (new Date(int(year) || 2018, int(month) || 0, 1)).getDay();
const str = v => String(v);
const lim = (v, limit) => str(v).slice(0, limit);
const lower = v => str(v).toLowerCase();
const onlyNum = (val, charLen) => lim(val, charLen || str(val).length).replace(/\D/g, '');
const intBool = v => v ? '0' : '1';
const noPx = v => onlyNum(v);
const px = v => `${v}px`;
const zeroPad2 = v => defined(v) ? zeroPad(v) : v;
const ampmToNum = v => lower(v) === 'am' ? 0 : (lower(v) === 'pm' ? 1 : int(v));

const titles = input => ['Select a year', 'Select the month', `${monthNames[int(input[1]) - 1]}, ${input[0]}`, 'Select the hour', 'Select the minute', 'Select the time of day'];
const Blur = props => html`<Div ${props} position="fixed"
  top="0px" bottom="0px" right="0px" left="0px" index="9000"></Div>`;
const Box = props => html`<Div
  ${assign({}, props, { children: undefined })}
  box="column initial center"
  overflow="hidden"
  position="absolute"
  mt="2px"
  notSelectable
  shadow="0px 3px 15px rgba(0,0,0,0.2)"
  background="white"
  border="1px solid #ccc"
  index="14000"
  p="20px">${props.children}</Div>`;
const Header = props => html`<Div ${props} box="row center center" b>${props.children}</Div>`;
const InnerBox = props => html`<Div
    flex="row"
    wrap="no-wrap"
    position="absolute"
    pl="inherit" pr="inherit"
    left=${`-${px(props.stage * props.width)}`}
    mt="-20px"
    minHeight=${px(props.height)}
    transition="left .3s">${props.children}</Div>`;
const Content = props => html`<Div
    width=${px(props.width)}
    box=${props.box || 'row center center'}><Div
      ${assign({}, props, { children: undefined, p: undefined, width: undefined, height: undefined })}
      box=${props.box || 'row center center'}
      wrap="wrap"
      mt="20px"
      height=${props.height || 'inherit'}
      p=${props.p || '20px'}>${props.children}</Div></Div>`;
const Item = props => html`<Div
    ${assign({}, props, { children: undefined, p: undefined })}
    box=${props.box || 'row center center'}
    minWidth="10px"
    minHeight="10px"
    unit=${props.unit || 'default'}
    p=${props.p || '10px'}
    pointer
    onclick=${props.goto(int(props.stage) + 1, props.last === true ? false : true, props.value)}
    background=${ampmToNum(props.input[props.stage]) === ampmToNum(props.value) ? props.colors.highlight : ''}
    hoverBackground=${props.colors.light}>${props.children}</Div>`;
const blink = styled.keyframes`
  50% { opacity: 0.8; }
`;
const overlayItem = (props, v) => (assign({
  onclick: props.goto(v, true) }, props.stage === v && props.input.open ? {
  color: props.colors.highlight,
  animation: `${blink} 1s step-start 0s infinite`,
} : {}));
const Overlay = props => html`<Div
    ${assign({}, props, { colors: undefined, input: undefined, getData: undefined, stage: undefined, goto: undefined })}
    box="row center center"
    position="absolute"
    index="10000"
    height="100%"
    cursor="text"
    color=${props.input.open || props.input.touched ? props.colors.dark : props.colors.light}>
    ${props.input.touched && !props.input.open && props.input[0] && props.input[1] && props.input[2] ? html`
      <Div onclick=${props.goto(0, true)}>${cap(daysOfWeek[props.date.getDay()].slice(0, 3))} ${cap(monthNames[int(props.input[1]) - 1]).slice(0, 3)} ${props.input[2]}, ${str(props.input[0]).slice(2, 4)}'</Div>
    ` : (props.onlyTime ? '' : html`<Div box="row center center">
      <Div ${overlayItem(props, 0)}>${(props.input.touched ? props.getData(0) : undefined) || 'yyyy'}</Div>
      <Div ${overlayItem(props, 1)}>-${(props.input.touched ? zeroPad2(props.getData(1)) : undefined) || 'mm'}</Div>
      <Div ${overlayItem(props, 2)}>-${(props.input.touched ? zeroPad2(props.getData(2)) : undefined) || 'dd'}</Div>
    </Div>`)}
    ${props.onlyDate ? '' : html`<Div flex="row" ml=${props.onlyTime ? '0px' : '20px'}>
      <Div ${overlayItem(props, 3)}>${props.getData(3) || 'hh'}</Div>
      :<Div ${overlayItem(props, 4)}>${zeroPad2(props.getData(4)) || 'mm'}</Div>
      <Div  ${overlayItem(props, 5)}>${props.getData(5) || (props.stage === 4 || props.stage === 5 ? '--' : '')}</Div>
    </Div>`}
  </Div>`;
const constrainInt = (v, len, min = 0, max, num = onlyNum(v === '' ? 0 : v, len)) => {
  return (num < min) ? undefined : (num > max ? max : num);
};
const constrain = stage => [
  year => constrainInt(year, 4, 1900, 2030),
  month => constrainInt(month, 2, 1, 12),
  day => constrainInt(day, 2, 1, 31),
  hour => constrainInt(hour, 2, 1, 12),
  minute => constrainInt(minute, 2, 0, 59),
  ampm => (lower(ampm) !== 'am' && lower(ampm) !== 'pm') ? 'pm' : lower(ampm),
][stage];
const buildDate = (i = {}, o = {}, n = assign(i, o)) => new Date(
  n[0] || 1900, // year
  int(n[1] || 1) - 1, // month
  n[2] || 1, // day
  int((n[3] || 1)) + (n[5] === "pm" ? 12 : 0), // hour
  n[4] || 0); // minute
const minMax = (v, min, max) => int(v) > max ? min : (int(v) < min ? max : int(v));
const dateToDefaults = d => ({ [0]: d[0], [1]: d[1], [2]: d[2], [3]: d[3], [4]: d[4] });

export const DatePicker = props => (state, actions) => {
  const input = assign({}, props.default ? dateToDefaults(props.default()) : {}, selectInput(state, props.id) || {}),
    change = obj => actions.inputs.change({ id: props.id, obj }),
    minStage = props.onlyTime ? 3 : 0,
    maxStage = props.onlyDate ? 2 : 5,
    stage = (!defined(input.stage) ? int(props.stage) : input.stage) || minStage,
    completed = input.completed || int(props.stage) || minStage,
    date = buildDate(input),
    len = stage === 0 ? 4 : 2,
    colors = assign({}, props.colors || { highlight: 'salmon', light: 'gray', dark: 'black' }),
    getData = stg => (stg === stage ? input.value : undefined) || (input || {})[stg],
    width = int(props.boxWidth) || 320,
    height = int(props.boxHeight) || 320,
    goto = (stg, open, value, s = minMax(stg, minStage, maxStage)) => e => {
      if ((value || input[stg - 1 < minStage ? minStage : stg - 1]) && s <= completed + 1)
        change(assign({ stage: s, open, date, completed: (stg <= completed ? completed : stg), value: '' }, value ? { [stage]: value } : {}));
    },
    onfocus = e => input.open === true ? null : change({ stage: stage || 0, open: true }),
    oninput = e => change({
      value: (stage === 5 ? lim : onlyNum)(e.target.value, len),
      [stage]: constrain(stage)(e.target.value) }),
    onkeydown = (e, code = e.keyCode) => {
      if ([9, 13, 39, 37].indexOf(code) !== -1)
        noop(goto(stage + (code === 37 ? -1 : 1), stage < maxStage ? e.preventDefault() || true : false)());
    };

  return html`
    <Div flex="column" inlineFlex>
      <Div box="column center center" inlineFlex position="relative">
        <Input ${assign(props, { onfocus, onkeydown, oninput })} color="rgba(0,0,0,0)"></Input>
        <Overlay ${{ input, stage, date, onlyDate: props.onlyDate, onlyTime: props.onlyTime, colors, goto, getData, onclick: e => focus(props.id) }}></Overlay>
      </Div>
      ${input.open ? html`<Div flex="column">
        <Blur onclick=${e => change({ open: false })}></Blur>
        <Div position="relative">
          <Box width=${px(width)} height=${px(height)} onclick=${e => (stage === maxStage ? noop : focus)(props.id)}>
            <Div position="absolute" bottom="20px" right="0px" left="0px" textAlign="center" s="12px" color=${colors.light}>Start typing or click...</Div>
            <Header>${(props.titles || titles)(input)[stage] || ''}</Header>
            <InnerBox ${{ stage, width, height }}>
              <Content ${{ width, p: '0px', pt: '0px' }}>${years.filter(v => v > 2017 && v < 2020).map(value => html`<Item
                ${{ stage, goto, input, colors, value }}>
                ${value}</Item>`)}</Content>
              <Content ${{ pt: '60px', width, p: '10px', box: 'row center flex-start' }}>${monthNames.map((value, i) => html`<Item
                ${{ stage, goto, mt: '10px', width: '24%', input, colors, value: i + 1 }}>
                ${cap(value)}</Item>`)}</Content>
              <Content ${{ p: '15%', box: 'row flex-start center', width }}>
                ${['su', 'mo','tu','we','th','fr','sa'].map(v => html`<Div
                  box="row center center"
                  color=${colors.dark}
                  width="30px" height="30px">
                  ${cap(v)}</Div>`)}
                ${Array(monthOffset(input[0], int(input[1]) - 1)).fill(0).map(v => html`<Div
                  width="30px" height="30px"></Div>`)}
                ${days.map(value => html`<Item
                ${{ stage, goto, input, colors, value, p: '0px', width: '30px', height: '30px', last: maxStage === 3 }}>
                  ${value}</Item>`)}</Content>
              <Content ${{ p: '20%', pt: '15px', height: '80px', width }}>${hours.map(value => html`<Item
                ${{ stage, width: '20px', height: '20px', goto, input, colors, value }}>
                ${value}</Item>`)}</Content>
              <Content ${{ p: '22%', pt: "15px", height: '80px', width }}>${basicMinutes.map(value => html`<Item
                ${{ stage, goto, width: '20px', height: '20px', input, colors, value }}>
                ${value}</Item>`)}</Content>
              <Content ${{ width }}>${['am', 'pm'].map(value => html`<Item
                ${{ stage, goto, width: '20px', height: '20px', m: '10px', input, colors, value, last: true }}>
                ${value}</Item>`)}</Content>
            </InnerBox>
          </Box>
        </Div>
      </Div>` : ''}
    </Div>
  `;
}
