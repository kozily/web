import React from "react";
import cx from "classnames";

export default function Icon(props) {
  const classes = cx("fa", `fa-${props.icon}`, props.className, {
    [`fa-${props.size}`]: !!props.size,
    "fa-fw": props.fixedWidth,
    "fa-spin": props.spin,
    "fa-pulse": props.pulse,
    [`fa-rotate-${props.rotate}`]: !!props.rotate,
    [`fa-flip-${props.flip}`]: !!props.flip,
    "fa-inverse": !!props.inverse,
    [`fa-stack-${props.stack}`]: !!props.stack,
  });

  return <i className={classes} />;
}

export function IconStack({ size, children }) {
  const classes = cx("fa-stack", {
    [`fa-${size}`]: !!size,
  });

  return <span className={classes}>{children}</span>;
}
