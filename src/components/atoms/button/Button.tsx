import { Link } from "react-router";

import type { ButtonProps, LinkProps } from "./Button.types";

export function Button(props: ButtonProps | LinkProps): React.JSX.Element {
  if (props.el === "link") {
    const { className, ...reset } = props;
    return (
      <Link className={`${className}`} {...reset}>
        {props.children}
      </Link>
    );
  }

  const { className, ...reset } = props;

  return (
    <button
      className={`py-1.5 px-4 inline-block bg-green-800 text-white rounded-sm ${className}`}
      {...reset}
    >
      {props.children}
    </button>
  );
}
