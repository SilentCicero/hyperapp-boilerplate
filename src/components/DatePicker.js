const {
  html,
  days, years, monthNames, hours, daysOfWeek, basicMinutes, ampm,
  zeroPad,
  cap,
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
  ObjectRemove,
} = require('../utils');
const { Div, Span } = require('./index');
const { selectInput, Input } = require('./Input');

const dateToObj = date => (date ? {
  [0]: date.getFullYear(),
  [1]: date.getMonth(),
  [2]: date.getDate(),
  [3]: date.getHours(),
  [4]: date.getMinutes(),
  [5]: date.getHours() > 12 ? 1 : 0,
} : {});
const HighlightMe = (props, stage) => props.stage === stage ? props.highight : '';
const Txt = (props, stage) => html`<Span color=${HighlightMe(props, stage)}>
  ${props[stage] || props.stages[stage].place}
</Span>`;
const OverlayText = props => html`<Div>
  ${Txt(props, 0)}-${Txt(props, 1)}-${Txt(props, 2)}
  ${Txt(props, 3)}${Txt(props, 4)}${Txt(props, 5)}
</Div>`;
const FooterMessage = props => html`<Div
  position="absolute"
  bottom="20px"
  right="0px"
  left="0px"
  textAlign="center"
  s="12px"
  color=${props.colors.light}>Start typing or click...</Div>`;
const defaults = (props, state) => {
  const minStage = props.onlyTime ? 3 : 0;

  return assign({}, props, {
    OverlayText,
    FooterMessage,
    open: false,
    min: dateToObj((props.min || noop)()),
    max: dateToObj((props.max || noop)()),
    width: onlyNum(props.width || 300),
    height: onlyNum(props.width || 300),
    minStage,
    maxStage: props.onlyDate ? 2 : 5,
    stage: minStage,
    completed: minStage,
    colors: { dark: 'darkgray', medium: 'gray', light: 'lightgray', highlight: 'salmon' },
    stages: {
      [0]: { raw: years, l: 4, min: 1900, max: 2030, place: 'yyyy' },
      [1]: { raw: monthNames, l: 2, min: 0, max: 11, place: 'mm' },
      [2]: { raw: days, l: 2, min: 1, max: 31, place: 'dd' },
      [3]: { raw: hours, l: 2, min: 1, max: 12, place: 'hh' },
      [4]: { raw: basicMinutes, l: 2, min: 0, max: 59, place: 'mm' },
      [5]: { raw: ampm, l: 2, min: 0, max: 1, place: '--' },
    },
  }, selectInput(state, props.id) || {});
};

export const DatePicker = props => (state, actions) => {
  console.log(defaults(props, state));

  return html`
    <Input ${props}></Input>
  `;
}
