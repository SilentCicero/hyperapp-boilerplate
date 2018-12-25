const {
  html,
  styled,
  ObjectMap,
} = require('../utils');
const MetaImport = require('./Meta');
export const Meta = MetaImport.Meta;

const divInsideProps = props => {
  return `
    ${props.position ? `
      position: ${props.position};
    ` : ''}

    ${(props.hide && (String(props.hide) === "true" || String(props.hide) === "1")) ? 'display: none;' : (props.flex ? `
      display: flex;
      flex-direction: ${props.flex};
    ` : '')}

    ${(props.hide && props.box && (String(props.hide) === "true" || String(props.hide) === "1")) ? 'display: none;' : (props.box && !props.flex ? `
      display: flex;
      flex-direction: ${props.box.split(' ')[0]};
      justify-content: ${props.box.split(' ')[1] || 'initial'};
      align-items: ${props.box.split(' ')[2] || 'initial'};
    ` : '')}
    ${(props.show === "1" || props.show === "true") ? (props.flex ? '' : `display: block;`) : ''}

    ${props.justify ? `
      justify-content: ${props.justify};
    ` : ''}
    ${props.width ? `
      width: ${props.width};
    ` : ''}
    ${props.minWidth ? `
      min-width: ${props.minWidth};
    ` : ''}
    ${props.maxHeight ? `
      max-height: ${props.maxHeight};
    ` : ''}
    ${props.height ? `
      height: ${props.height};
    ` : ''}
    ${props.background ? `
      background: ${props.background};
    ` : ''}
    ${props.left ? `
      left: ${props.left};
    ` : ''}
    ${props.top ? `
      top: ${props.top};
    ` : ''}
    ${props.bottom ? `
      bottom: ${props.bottom};
    ` : ''}
    ${props.right ? `
      right: ${props.right};
    ` : ''}

    ${props.border ? `
      border: ${props.border};
    ` : ''}
    ${props.borderTop ? `border-top: ${props.borderTop};` : ''}
    ${props.borderBottom ? `border-bottom: ${props.borderBottom};` : ''}
    ${props.borderRight ? `border-right: ${props.borderRight};` : ''}
    ${props.borderLeft ? `border-left: ${props.borderLeft};` : ''}

    ${props.bt ? `border-top: ${props.bt};` : ''}
    ${props.bb ? `border-bottom: ${props.bb};` : ''}
    ${props.br ? `border-right: ${props.br};` : ''}
    ${props.bl ? `border-left: ${props.bl};` : ''}

    ${props.m ? `margin: ${props.m};` : ''}
    ${props.mt ? `margin-top: ${props.mt};` : ''}
    ${props.mb ? `margin-bottom: ${props.mb};` : ''}
    ${props.ml ? `margin-left: ${props.ml};` : ''}
    ${props.mr ? `margin-right: ${props.mr};` : ''}

    ${props.p ? `padding: ${props.p};` : ''}
    ${props.pt ? `padding-top: ${props.pt};` : ''}
    ${props.pb ? `padding-bottom: ${props.pb};` : ''}
    ${props.pl ? `padding-left: ${props.pl};` : ''}
    ${props.pr ? `padding-right: ${props.pr};` : ''}

    ${props.unit ? `flex: ${props.unit};` : ''}
    ${props.pointer ? `cursor: pointer;` : ''}
    ${props.cursor ? `cursor: ${props.cursor};` : ''}
    ${props.opacity ? `opacity: ${props.opacity};` : ''}
    ${props.ellipsis ? `white-space: nowrap; text-overflow: ellipsis;` : ''}
    ${props.overflow ? `overflow: ${props.overflow};` : ''}
    ${props.overflowX ? `overflow-x: ${props.overflowX};` : ''}
    ${props.self ? `align-self: ${props.self};` : ''}
    ${props.color ? `color: ${props.color};` : ''}
    ${props.align ? `align-items: ${props.align};` : ''}
    ${props.textAlign ? `text-align: ${props.textAlign};` : ''}
    ${props.notSelectable ? `
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;` : ''}
    ${props.transition ? `
      -webkit-transition: ${props.transition};
      transition: ${props.transition};
    ` : ''}
    ${props.radius ? `border-radius: ${props.radius};` : ''}
    ${props.shadow ? `box-shadow: ${props.shadow};` : ''}
    ${props.b ? `font-weight: bold;` : ''}
    ${props.weight ? `font-weight: ${props.weight};` : ''}
    ${props.s ? `font-size: ${props.s};` : ''}
    ${props.index ? `z-index: ${props.index};` : ''}
    ${props.wrap ? `flex-wrap: ${props.wrap};` : ''}

    ${props.transition ? `
      -webkit-transition: ${props.transition};
      -moz-transition: ${props.transition};
      -o-transition: ${props.transition};
      -ms-transition: ${props.transition};
      transition: ${props.transition};
      ` : ''}

    &:focus {
      ${props.focusShadow ? `box-shadow: ${props.focusShadow};` : ''}
      ${props.focusBorder ? `border: ${props.focusBorder}; ` : ''}
      ${props.focusBorderColor ? `border-color: ${props.focusBorderColor}; ` : ''}
    }

    &:hover {
      ${props.hoverBackground ? `background: ${props.hoverBackground}; ` : ''}
      ${props.hoverShadow ? `box-shadow: ${props.hoverShadow};` : ''}
      ${props.hoverBorder ? `border: ${props.hoverBorder}; ` : ''}
    }
  `;
};
export const mediaProps = (props, method) => `
  ${method(ObjectMap(props, (k, v) => String(v).split('|')[0]))}

  @media only screen and (max-width:1200px) {
    ${method(ObjectMap(props, (k, v) => String(v).split('|')[2]))}
  }

  @media only screen and (max-width:640px) {
    ${method(ObjectMap(props, (k, v) => String(v).split('|')[1]))}
  }

  @media print {
    ${props.noPrint ? 'display: none;' : ''}
    ${method(ObjectMap(props, (k, v) => String(v).split('|')[3]))}
  }
`;
export const Div = styled.div`
  ${props => mediaProps(props, divInsideProps)}
`;
export const Button = styled.button`
  ${props => mediaProps(props, divInsideProps)}
`;
export const Input = styled.input`
  ${props => mediaProps(props, divInsideProps)}
`;
export const Textarea = styled.textarea`
  ${props => mediaProps(props, divInsideProps)}
`;
export const Img = styled.img`
  ${props => mediaProps(props, divInsideProps)}
`;
export const Span = styled.span`
  ${props => mediaProps(props, divInsideProps)}
`;
export const A = styled.a`
  ${props => mediaProps(props, divInsideProps)}
`;
