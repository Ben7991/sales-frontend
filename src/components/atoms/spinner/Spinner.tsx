import css from "./Spinner.module.css";

export function Spinner(props: {
  size: "sm" | "md";
  color: "white" | "black";
}): React.JSX.Element {
  return (
    <div className={`${css.loader} ${css[props.size]} ${css[props.color]}`} />
  );
}
