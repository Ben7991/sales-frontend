import { Link } from "react-router";

import type { ButtonProps, LinkProps } from "./Button.types";
import { Spinner } from "../spinner/Spinner";

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
      className={`py-1.5 px-4 inline-block bg-green-700 hover:bg-green-800 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...reset}
    >
      {props.children}
    </button>
  );
}

function Loader(): React.JSX.Element {
  return (
    <span className="flex items-center justify-center gap-2">
      <Spinner size="sm" color="white" />
      <span>Loading...</span>
    </span>
  );
}

Button.Loader = Loader;
