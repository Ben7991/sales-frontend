import { Link } from "react-router";

import type { ButtonProps, LinkProps } from "./Button.types";
import { Spinner } from "../spinner/Spinner";

export function Button(props: ButtonProps | LinkProps): React.JSX.Element {
  let variantClassnames = "bg-green-700 hover:bg-green-800 text-white py-1.5";

  if (props.variant === "outline") {
    variantClassnames =
      "bg-white border border-gray-300 py-[5px] hover:bg-gray-100";
  } else if (props.variant === "danger") {
    variantClassnames = "bg-red-700 hover:bg-red-800 text-white py-1.5";
  }

  if (props.el === "link") {
    const { className, ...reset } = props;
    return (
      <Link
        className={`px-3 inline-block ${variantClassnames} rounded-sm ${className}`}
        {...reset}
      >
        {props.children}
      </Link>
    );
  }

  const { className, ...reset } = props;

  return (
    <button
      className={`px-3 inline-block ${variantClassnames} rounded-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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
