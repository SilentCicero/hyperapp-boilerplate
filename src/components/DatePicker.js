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
  defined,
  int,
  monthOffset,
  str,
  lim,
  lower,
  onlyNum,
  intBool,
  noPx,
  px,
  zeroPad2,
  ampmToNum,
  ObjectRemove,
} = require('../utils');
const { Div, Span } = require('./index');
const { selectInput, Input } = require('./Input');

const titles = input => ['Select a year', 'Select the month', `${monthNames[int(input[1]) - 1]}, ${input[0]}`, 'Select the hour', 'Select the minute', 'Select the time of day'];

const blink = styled.keyframes`
  50% { color: INDIANRED; }
`;
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
const dateToDefaults = d => d;
const codeMap = (input, code) => (code === 37 ? -1 : (code === 39 ? 1 : [
  5, 3, 7, 4, 4, 1
][input.stage] * (code === 40 ? 1 : -1))) * (input.stage === 4 ? 5 : 1) - (input.stage === 4 && int(input[4]) === 59 ? 4 : 0);

export const DatePicker = props => (state, actions) => {
  const input = assign({}, props.default ? dateToDefaults(props.default()) : {}, selectInput(state, props.id) || {}),
    change = obj => actions.inputs.change({ id: props.id, obj }),
    minStage = props.onlyTime ? 3 : 0,
    maxStage = props.onlyDate ? 2 : 5,
    stage = (!defined(input.stage) ? int(props.stage) : input.stage) || minStage,
    completed = input.completed || int(props.stage) || minStage,
    filters = props.filters || {},
    filter = v => (filters[stage] || (() => true))(v),
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
      if ([9, 13].indexOf(code) !== -1) // tab and enter
        noop(goto(stage + 1, stage < maxStage ? e.preventDefault() || true : false)());
      if ([37, 38, 39, 40].indexOf(code) !== -1) // arrow keys
        change({ [stage]: constrain(stage)(int(defined(input[stage]) ? input[stage] : 0) + codeMap(input, code))});
    },
    Blur = blurProps => html`<Div
      onclick=${e => change({ open: false })}
      position="fixed"
      top="0px"
      bottom="0px"
      right="0px"
      left="0px"
      index="9000"></Div>`,
    Box = boxProps => html`<Div
      width=${px(width)}
      height=${px(height)}
      onclick=${e => (stage === maxStage ? noop : focus)(props.id)}
      box="column initial center"
      overflow="hidden"
      position="absolute"
      mt="2px"
      notSelectable
      shadow="0px 3px 15px rgba(0,0,0,0.2)"
      background="white"
      border="1px solid #ccc"
      index="14000"
      p="20px">${boxProps.children}</Div>`,
    Header = headerProps => html`<Div box="row center center" b>${headerProps.children}</Div>`,
    InnerBox = innerBoxProps => html`<Div
        flex="row"
        wrap="no-wrap"
        position="absolute"
        pl="inherit" pr="inherit"
        left=${`-${px(stage * (width + 20))}`}
        mt="-20px"
        minHeight=${px(height)}
        transition="left .3s">${innerBoxProps.children}</Div>`,
    Content = contentProps => html`<Div
        width=${px(contentProps.width)}
        mr="20px"
        box=${contentProps.box || 'row center center'}><Div
        ${contentProps.scrollIt ? { y: 'auto' } : {}}
        ${ObjectRemove(contentProps, 'children', 'mt', 'p', 'width', 'height')}
        box=${props.box || 'row center center'}
        wrap="wrap"
        mt=${contentProps.mt || '20px'}
        height=${contentProps.height || 'inherit'}
        p=${contentProps.p || '20px'}>${contentProps.children}</Div></Div>`,
    Item = itemProps => html`<Div
        ${ObjectRemove(itemProps, 'children', 'p')}
        box=${itemProps.box || 'row center center'}
        minWidth="10px"
        minHeight="10px"
        unit=${itemProps.unit || 'default'}
        p=${itemProps.p || '10px'}
        pointer
        onclick=${goto(int(stage) + 1, itemProps.last === true ? false : true, itemProps.value)}
        background=${ampmToNum(input[stage]) === ampmToNum(itemProps.value) ? colors.highlight : ''}
        hoverBackground=${colors.light}>${itemProps.children}</Div>`,
    SubMessage = () => html`<Div position="absolute" bottom="20px" right="0px" left="0px" textAlign="center" s="12px" color=${colors.light}>Start typing or click...</Div>`,
    overlayItem = (itemProps, v) => (assign({
      onclick: goto(v, true) }, stage === v && input.open ? {
      color: colors.highlight,
      animation: input[v] ? '' : `${blink} 1s step-start 0s infinite`,
    } : {})),
    Overlay = overlayProps => html`<Div
        onclick=${e => focus(props.id)}
        box="row center center"
        position="absolute"
        index="10000"
        height="100%"
        cursor="text"
        color=${input.open || input.touched ? colors.dark : colors.light}>
        ${input.touched && !input.open && input[0] && input[1] && input[2] ? html`
          <Div onclick=${goto(0, true)}>${cap(daysOfWeek[date.getDay()].slice(0, 3))} ${cap(monthNames[int(input[1]) - 1]).slice(0, 3)} ${input[2]}, ${str(input[0]).slice(2, 4)}'</Div>
        ` : (props.onlyTime ? '' : html`<Div box="row center center">
          <Div ${overlayItem(props, 0)}>${(input.touched ? getData(0) : undefined) || 'yyyy'}</Div>
          <Div ${overlayItem(props, 1)}>-${(input.touched ? zeroPad2(getData(1)) : undefined) || 'mm'}</Div>
          <Div ${overlayItem(props, 2)}>-${(input.touched ? zeroPad2(getData(2)) : undefined) || 'dd'}</Div>
        </Div>`)}
        ${props.onlyDate ? '' : html`<Div flex="row" ml=${props.onlyTime ? '0px' : '20px'}>
          <Div ${overlayItem(props, 3)}>${getData(3) || 'hh'}</Div>
          :<Div ${overlayItem(props, 4)}>${zeroPad2(getData(4)) || 'mm'}</Div>
          <Div  ${overlayItem(props, 5)}>${getData(5) || (stage === 4 || stage === 5 ? '--' : '')}</Div>
        </Div>`}
      </Div>`;

  return html`
    <Div flex="column" inlineFlex>
      <Div box="column center center" inlineFlex position="relative">
        <Input ${assign(props, { onfocus, onkeydown, oninput, color: 'rgba(0,0,0,0)' })}></Input>
        <Overlay></Overlay>
      </Div>
      ${input.open ? html`<Div flex="column">
        <Blur></Blur>
        <Div position="relative">
          <Box>
            <Header>${(props.titles || titles)(input)[stage] || ''}</Header>
            <InnerBox ${{ stage, width, height }}>
              <Content ${{ width, height: '240px', scrollIt: true, p: '0px', mt: '45px' }}>${years.filter(filter)
                .map(value => html`<Item ${{ value }}>
                ${value}</Item>`)}</Content>
              <Content ${{ pt: '60px', width, p: '10px', box: 'row center flex-start' }}>${monthNames
                .map((value, i) => html`<Item ${{ mt: '10px', width: '24%', value: i + 1 }}>
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
                ${{ value, p: '0px', width: '30px', height: '30px', last: maxStage === 3 }}>
                  ${value}</Item>`)}</Content>
              <Content ${{ p: '20%', pt: '15px', height: '80px', width }}>${hours.map(value => html`<Item
                ${{ width: '20px', height: '20px', value }}>
                ${value}</Item>`)}</Content>
              <Content ${{ p: '22%', pt: "15px", height: '80px', width }}>${basicMinutes.map(value => html`<Item
                ${{ width: '20px', height: '20px', value }}>
                ${value}</Item>`)}</Content>
              <Content ${{ width }}>${['am', 'pm'].map(value => html`<Item
                ${{ width: '20px', height: '20px', m: '10px', value, last: true }}>
                ${value}</Item>`)}</Content>
            </InnerBox>
            <SubMessage></SubMessage>
          </Box>
        </Div>
      </Div>` : ''}
    </Div>
  `;
}
