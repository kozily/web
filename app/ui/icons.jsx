import 'font-awesome/scss/font-awesome.scss';
import React from 'react';
import cx from 'classnames';

export default function Icon(props) {
  const classes = cx(
    'fa', `fa-${props.icon}`, props.className, {
      [`fa-${props.size}`]: !!props.size,
      'fa-fw': props.fixedWidth,
      'fa-spin': props.spin,
      'fa-pulse': props.pulse,
      [`fa-rotate-${props.rotate}`]: !!props.rotate,
      [`fa-flip-${props.flip}`]: !!props.flip,
      'fa-inverse': !!props.inverse,
      [`fa-stack-${props.stack}`]: !!props.stack,
    }
  );

  return (
    <i className={classes} />
  );
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  size: React.PropTypes.oneOf(['lg', '1x', '2x', '3x', '4x', '5x']),
  fixedWidth: React.PropTypes.bool,
  spin: React.PropTypes.bool,
  pulse: React.PropTypes.bool,
  rotate: React.PropTypes.oneOf(['90', '180', '270']),
  flip: React.PropTypes.oneOf(['horizontal', 'vertical']),
  inverse: React.PropTypes.bool,
  className: React.PropTypes.string,
  stack: React.PropTypes.oneOf(['1x', '2x']),
};

export function IconStack({ size, children }) {
  const classes = cx(
    'fa-stack', {
      [`fa-${size}`]: !!size,
    }
  );

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

IconStack.propTypes = {
  size: React.PropTypes.string,
  children: React.PropTypes.arrayOf(React.PropTypes.element),
};
