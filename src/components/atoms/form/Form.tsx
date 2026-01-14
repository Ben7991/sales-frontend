import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";
import type { FormControlProps, PasswordTogglerProps } from "./Form.types";
import { GoEye, GoEyeClosed } from "react-icons/go";

function Form(props: ComponentPropsWithRef<"form">): React.JSX.Element {
  return <form {...props}>{props.children}</form>;
}

function Group(props: ComponentPropsWithoutRef<"div">): React.JSX.Element {
  return <div {...props}>{props.children}</div>;
}

function Label(props: ComponentPropsWithoutRef<"label">): React.JSX.Element {
  const { className, ...rest } = props;

  return (
    <label className={`inline-block mb-1 ${className}`} {...rest}>
      {props.children}
    </label>
  );
}

function Control({
  leftIcon,
  rightIcon,
  hasError,
  ...props
}: FormControlProps): React.JSX.Element {
  const { className, ...reset } = props;
  return (
    <div
      className={`form-control flex items-center gap-2 border ${
        hasError ? "border-red-600" : "border-gray-200 hover:border-gray-400"
      } rounded-sm px-3 py-1.5 ${className}`}
    >
      {leftIcon}
      <input className="grow outline-none" {...reset} />
      {rightIcon}
    </div>
  );
}

function PasswordToggler({
  state,
  onClick,
}: PasswordTogglerProps): React.JSX.Element {
  return (
    <button onClick={onClick} type="button">
      {state ? (
        <GoEye className="text-xl" />
      ) : (
        <GoEyeClosed className="text-xl" />
      )}
    </button>
  );
}

Form.Group = Group;
Form.Label = Label;
Form.Control = Control;
Form.PasswordToggler = PasswordToggler;

export { Form };
