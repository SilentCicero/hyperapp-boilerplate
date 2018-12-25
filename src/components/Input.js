const regeneratorRuntime = require("regenerator-runtime");
const {
  html,
  ObjectMap,
  noop,
  assign,
  byid,
} = require('../utils');
const components = require('./index');
const InputInner = components.Input;
const TextareaInner = components.Textarea;
const Div = components.Div;
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

    validators[props.id] = props.validate;
    warnings[props.id] = props.warn;
  },
  touch: e => (state, actions) => {
    if(!selectInput({ inputs: state }, e.target.id).touched) actions.change({ id: e.target.id, obj: {
      touched: true,
    }});
  },
  validate: ({ form, validate, onValid }) => async (state, actions) => {
    const keys = Object.keys(state[form]),
      values = {},
      errors = {};
    for (let k = 0; k < keys.length; k++) { // inputs
      const id = keys[k],
        valids = (validators[`${form}.${id}`] || noop)() || [],
        input = selectInput({ inputs: state }, `${form}.${id}`);

      for (let i = 0; i < valids.length; i++) {
        const raw = valids[i](values[id] = input.value, input),
          result = await ((raw || {}).then ? raw : Promise.resolve(raw));

        if (result) {
          errors[id] = result;
          actions.change({ id: `${form}.${id}`, obj: {
            error: result,
          }});
          i = valids.length; // stop sub loop
        }
      }
    }
    const validateMethod = (validate || noop)(values);
    const validResult = assign(errors, (validateMethod.then ? (await validateMethod) : validateMethod) || {}); // errors res
    let isValid = true;

    ObjectMap(validResult, (id, error) => {
      if (error) isValid = false;
      actions.change({ id: `${form}.${id}`, obj: { error }});
    });
    if (isValid) (onValid || noop)();
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
    ${assign({}, props, { value: undefined, oninput: undefined, onupdate: undefined, oncreate: undefined, onfocus: undefined })}
    oncreate=${e => noop(actions.inputs.create(props), (props.oncreate || noop)())}
    onupdate=${(e, o) => noop(actions.inputs.update({ elm: e, old: o, props }), (props.onupdate || noop)())}
    value=${props.value || ((state.inputs[d.form] || {})[d.id] || {}).value}
    onfocus=${e => noop(actions.inputs.touch(e), (props.onfocus || noop)(e))}
    oninput=${e => noop(actions.inputs.input(e), (props.oninput || noop)(e))}></InputInner>`;

export const SearchInput = props => (state, actions) => {
  const input = selectInput(state, props.id) || {},
    change = obj => actions.inputs.change({ id: props.id, obj }),
    list = ((props.list || noop)() || []),
    defaultIndex = list.map(v => String(v)).indexOf(props.default),
    option = (v, i) => v,
    index = typeof input.index !== "undefined" ? input.index : (defaultIndex < 0 ? 0 : defaultIndex);

  return html`<Div flex="column" position="relative">
    <Input ${props}
      onkeydown=${e => {
        change({ open: true });
        let changeIndex = index;
        if(e.keyCode === 38) changeIndex = index - 1 < 0 ? 0 : index - 1;
        if(e.keyCode === 40) changeIndex = index + 1 >= list.length ? list.length - 1 : index + 1;
        if(e.keyCode === 13) {
          change({ value: list[changeIndex] || list[0], open: false });
          if(props.next) byid(props.next).focus();
        }
        if(e.keyCode == 38 || e.keyCode == 40) {
          change({ stallScroll: false, index: changeIndex, scrollStall: true, value: list[changeIndex] });
          const height = byid(`${props.id}_0`).offsetHeight;
          byid(`${props.id}_options`).scrollTop = height * changeIndex;
          e.preventDefault();
        }
        if(e.keyCode === 9) {
          change({ value: list[index], open: false });
          e.preventDefault();
          if(props.next) byid(props.next).focus();
        }
      }}
      oninput=${e => {
        const find = list.filter(v => String(v).indexOf(String(input.value)) >= 0),
          findIndex = list.indexOf(find[0]);
        if([38, 40, 13, 9].indexOf(event.which || event.keyCode) === -1) {
          if (props.strict && findIndex < 0) change({ value: list[index] });
          change({ stallScroll: false, index: findIndex < 0 ? index : findIndex });
        }
      }}
      onfocus=${e => change({ open: true })}></Input>
    <Div
      hide=${input.open ? '0' : '1'}
      onclick=${e => change({ open: false })}
      position="fixed" top="0px" bottom="0px" right="0px" left="0px" index="1200"></Div>
    <Div position="relative"><Div
      position="absolute"
      index="13000"
      overflowX="hidden"
      onupdate=${elm => input.stallScroll ? null : (elm.scrollTop = (38 * index) || 0)}
      id=${`${props.id}_options`}
      hide=${input.open ? '0' : '1'}
      overflow="scroll"
      ${assign({ width: '200px', align: 'left', maxHeight: '250px' }, props.options)}>
      ${list.map((value, i) => html`<Div
          id=${`${props.id}_${i}`}
          data-num=${`${i}`}
          notSelectable
          hoverBackground=${'#F1F1F1'}
          p="10px"
          onclick=${e => change({ index: i, value, open: false })}
          background=${i === index ? 'red' : 'white'}>${(props.option || option)(value)}</Div>`)}
    </Div></DIv>
  </Div>`;
}

export const Textarea = props => (state, actions, d = nameData(props.id)) => html`<TextareaInner
    ${assign({}, props, { value: undefined, oninput: undefined, onupdate: undefined, oncreate: undefined, onfocus: undefined })}
    oncreate=${e => noop(actions.inputs.create(props), (props.oncreate || noop)())}
    onupdate=${(e, o) => noop(actions.inputs.update({ elm: e, old: o, props }), (props.onupdate || noop)())}
    value=${props.value || ((state.inputs[d.form] || {})[d.id] || {}).value}
    onfocus=${e => noop(actions.inputs.touch(e), (props.onfocus || noop)(e))}
    oninput=${e => noop(actions.inputs.input(e), (props.oninput || noop)(e))}></TextareaInner>`;
