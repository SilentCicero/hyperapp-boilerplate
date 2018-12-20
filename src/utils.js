const regeneratorRuntime = require("regenerator-runtime");
const styled = require('../internals/styled-elements').default;
const { h, app } = require('hyperapp');
const hyperx = require('hyperx');
const { Link, Route, location, Switch } = require('@hyperapp/router');
const removeChildren = props => { delete props.children; return props; }
const Goto = (props, ...children) => Link(removeChildren(props), children);
const RouterSwitch = (props, ...children) => {
  return Switch(removeChildren(props), children.filter(v => typeof v === 'function'));
};
const assign = Object.assign;
const html = hyperx((tag, props = {}, children = []) => {
  if (props.higherComponent && typeof props.higherComponent === 'function') {
    const component = props.higherComponent;
    const newProps = Object.assign({}, props, { children });
    delete newProps.higherComponent;
    const keys = Object.keys(newProps);
    for (var i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (newProps[key] === 'undefined') {
        newProps[key] = undefined;
      }

      if (newProps[key] === 'null') {
        newProps[key] = null;
      }

      if (newProps[key] === 'false') {
        newProps[key] = false;
      }

      if (newProps[key] === 'true') {
        newProps[key] = true;
      }
    }

    return component(newProps, ...children);
  }

  const style = props.style ? props.style.split(';')
    .map(p => ({ [p.split(':')[0]]: [p.split(':')[1]] }))
    .reduce((acc, v) => assign(acc, v), {}) : {};

  return h(tag, assign(props, { style }), children);
});

// standard route method
const route = pathname => {
  window.scrollTo(0, 0);
  history.pushState(null, "", pathname);
};
const el = v => document.querySelector(v) || {};

function byid(id) {
  return el(`#${id}`);
}

function val(id) {
  return el(`#${id}`).value;
}

function zeroPad(v) {
  return String(v).length === 1 ? `0${v}` : String(v);
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
  };
}

const upper = v => String(v).toUpperCase();
const monthNames = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

function focus(id, time = 1) {
  setTimeout(e => {
    byid(id).focus();
  }, time);
}

const noop = () => {};
const ObjectMap = (o, f, keys = Object.keys(o)) => keys
  .map((k, i) => f(k, o[k], i))
  .reduce((a, v, i) => assign(a, { [keys[i]]: v }), {});

const year = () => (new Date()).getFullYear();
const day = () => (new Date()).getDate();
const month = () => (new Date()).getMonth();

const years = Array(130).fill(0).map((e, i) => (i + 1) + 1900);
const months = Array(12).fill(0).map((e, i) => i);
const days = Array(31).fill(0).map((e, i) => i + 1);
const hours = Array(12).fill(0).map((e, i) => i + 1);
const minutes = Array(60).fill(0).map((e, i) => i + 1);
const basicMinutes = [0,5,10,15,20,25,30,35,40,45,50,55,59];
const daysOfWeek = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'];
const ampm = ['am', 'pm'];

const cap = v => String(v).charAt(0).toUpperCase() + String(v).substr(1);

const saveCSV = (table = [['test'],['data']], filename = 'file') => { // [['col','col']]
  const rows = table;
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach(function(rowArray){
     let row = rowArray.join(",");
     csvContent += row + "\r\n";
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click(); // This
};
const tabFocus = (id, o) => e => e.which === 9 ? noop((o || noop)(), e.preventDefault(), byid(id).focus()) : null;
const onLoad = e => window.addEventListener('load', e);

const ping = ({ url, timeout }) => {
  return new Promise(resolve => {
    const isOnline = () => resolve(true);
    const isOffline = () => resolve(false);

    const xhr = new XMLHttpRequest();

    xhr.onerror = isOffline;
    xhr.ontimeout = isOffline;
    xhr.onload = () => {
      const response = xhr.responseText.trim();
      if (!response) {
        isOffline();
      } else {
        isOnline();
      }
    };

    xhr.open("GET", url);
    xhr.timeout = timeout;
    xhr.send();
  });
};
const getip = () => ping({
  url: 'https://icanhazip.com/',
  timeout: 10000
});
const callInterval = (e, i) => {
  e();
  setInterval(e, i);
};
const isOnline = callback => callInterval(e => getip()
  .then(online => online === true ? callback(true) : callback(false))
  .catch(e => null), 10000);

const embed = opts => ({
  tag: 'div',
  children: [],
  data: {
    key: opts.key,
    oncreate: el => setTimeout(_ => {
      const fakeRoot = document.createElement('div')
      opts.root = fakeRoot
      app(opts)
      el.parentNode.replaceChild(fakeRoot.childNodes[0], el)
    })
  }
});

module.exports = {
  years,
  months,
  days,
  hours,
  minutes,
  basicMinutes,
  daysOfWeek,
  ampm,
  saveCSV,
  onLoad,
  isOnline,
  ObjectMap,

  regeneratorRuntime,
  route,
  html,
  assign,
  app,
  tabFocus,
  styled,
  location,
  Route,
  RouterSwitch,
  year,
  day,
  month,
  noop,
  focus,
  el,
  cap,
  upper,
  monthNames,
  getOffset,
  zeroPad,
  val,
  byid,
};
