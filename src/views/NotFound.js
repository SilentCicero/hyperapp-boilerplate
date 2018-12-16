const {
  html,
} = require('../utils');
const { Div, Meta } = require('../components/index');

export const NotFound = props => (state, actions) => {
  return html`
    <Div mt="100px">
      <Meta title="Not Found"></Meta>
      Sorry.. page not found :(
    </Div>
  `;
}
