const {
  html,
} = require('../utils');

export const Meta = props => (state, actions) => {
  const update = () => {
    document.title = props.title;
    document.description = props.description;
  };

  return html`<span oncreate=${update} onupdate=${update}></span>`;
}
