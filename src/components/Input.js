const {
  html,
  ObjectMap,
  noop,
  assign,
} = require('../utils');
const components = require('./index');
const InputInner = components.Input;
const selectForm = id => String(id).split('.')[0];
const selectId = id => String(id).split('.')[1] || String(id).split('.')[0];
const nameData = id => ({ id: selectId(id), form: selectForm(id) });

export const selectInput = (state, id, d = nameData(id)) => ((state.inputs[d.form] || {})[d.id] || {});

// for instal state and actions must be titled 'inputs'

export const state = {
};
export const actions = {
  change: ({ id, obj }) => (state, a, data = nameData(id)) => ({
    [data.form]: assign(state[data.form] || {}, {
      [data.id]: assign((state[data.form] || {})[data.id] || {}, obj || {}),
    }),
  }),
  create: elm => (state, actions) => {
    actions.change({ id: elm.id, obj: {
      touched: false,
      error: null,
      value: elm.defaultValue,
      defaultValue: elm.defaultValue,
    }});
  },
  update: ({ elm, old }) => (state, actions) => {
    if(elm.id !== old.id) actions.change({ id: elm.id, obj: {
      touched: false,
      error: null,
      value: elm.defaultValue,
      defaultValue: elm.defaultValue,
    }});
  },
  touch: e => (state, actions) => {
    if(!selectInput({ inputs: state }, e.target.id).touched) actions.change({ id: e.target.id, obj: {
      touched: true,
    }});
  },
  input: e => (state, actions) => {
    actions.change({ id: e.target.id, obj: {
      value: e.target.value,
    }});
  },
};

export const Input = props => (state, actions, d = nameData(props.id)) => html`<InputInner
  ${props}
  oncreate=${e => actions.inputs.create(props)}
  value=${((state.inputs[d.form] || {})[d.id] || {}).value}
  onfocus=${actions.inputs.touch}
  oninput=${e => noop(actions.inputs.input(e), (props.oninput || noop)(e))}></InputInner>`;
