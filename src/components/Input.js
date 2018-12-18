const regeneratorRuntime = require("regenerator-runtime");
const {
  html,
  ObjectMap,
  noop,
  assign,
} = require('../utils');
const components = require('./index');
const InputInner = components.Input;
const TextareaInner = components.Textarea;
const selectForm = id => String(id).split('.')[0];
const selectId = id => String(id).split('.')[1] || String(id).split('.')[0];
const nameData = id => ({ id: selectId(id), form: selectForm(id) });

export const required = value => (value || typeof value === 'number' ? undefined : 'Required');
export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const maxLength15 = maxLength(15);
export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const minLength2 = minLength(2);
export const number = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;
export const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined;
export const minValue13 = minValue(13);
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;
export const tooYoung = value =>
  value && value < 13
    ? 'You do not meet the minimum age requirement!'
    : undefined;
export const aol = value =>
  value && /.+@aol\.com/.test(value)
    ? 'Really? You still use AOL for your email?'
    : undefined;
export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined;
export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined;

export const selectInput = (state, id, d = nameData(id)) => ((state.inputs[d.form] || {})[d.id] || {});

// for instal state and actions must be titled 'inputs'

export const validators = {
};
export const warnings = {
};

export const state = {
};
export const actions = {
  change: ({ id, obj }) => (state, a, data = nameData(id)) => ({
    [data.form]: assign(state[data.form] || {}, {
      [data.id]: assign((state[data.form] || {})[data.id] || {}, obj || {}),
    }),
  }),
  create: props => (state, actions) => {
    actions.change({ id: props.id, obj: {
      touched: false,
      error: null,
      value: props.defaultValue || '',
      defaultValue: props.defaultValue,
    }});
    validators[props.id] = props.validate;
    warnings[props.id] = props.warn;
  },
  update: ({ elm, old, props }) => (state, actions) => {
    if(elm.id !== old.id) actions.change({ id: elm.id, obj: {
        touched: false,
        error: null,
        value: elm.defaultValue,
        defaultValue: elm.defaultValue,
      }});

    validators[props.id] = elm.validate;
    warnings[props.id] = props.warn;
  },
  touch: e => (state, actions) => {
    if(!selectInput({ inputs: state }, e.target.id).touched) actions.change({ id: e.target.id, obj: {
      touched: true,
    }});
  },
  clear: form => (state, actions) => {
    const inputs = state[form];
    ObjectMap(inputs, (k, v) => actions.change({ id: `${form}.${k}`, obj: {
      value: '',
      error: null,
    }}));
  },
  clearDefault: form => (state, actions) => {
    const inputs = state[form];
    ObjectMap(inputs, (k, v) => actions.change({ id: `${form}.${k}`, obj: {
      value: v.defaultValue || '',
      error: null,
    }}));
  },
  input: e => async (state, actions) => {
    actions.change({ id: e.target.id, obj: {
      value: e.target.value,
      error: null,
    }});
    const warns = warnings[e.target.id] ? warnings[e.target.id]() : [];
    for (var i = 0; i < warns.length; i++) {
      const raw = warns[i](e.target.value);
      const result = await ((raw || {}).then ? raw : Promise.resolve(raw));

      if (result) return actions.change({ id: e.target.id, obj: {
        error: result,
      }});
    }
    actions.change({ id: e.target.id, obj: {
      error: null,
    }});
  },
};

export const Input = props => (state, actions, d = nameData(props.id)) => html`<InputInner
    ${props}
    oncreate=${e => actions.inputs.create(props)}
    onupdate=${(e, o) => actions.inputs.update({ elm: e, old: o, props })}
    value=${((state.inputs[d.form] || {})[d.id] || {}).value}
    onfocus=${actions.inputs.touch}
    oninput=${e => noop(actions.inputs.input(e), (props.oninput || noop)(e))}></InputInner>`;

export const Textarea = props => (state, actions, d = nameData(props.id)) => html`<TextareaInner
    ${props}
    oncreate=${e => actions.inputs.create(props)}
    onupdate=${(e, o) => actions.inputs.update({ elm: e, old: o, props })}
    value=${((state.inputs[d.form] || {})[d.id] || {}).value}
    onfocus=${actions.inputs.touch}
    oninput=${e => noop(actions.inputs.input(e), (props.oninput || noop)(e))}></TextareaInner>`;
