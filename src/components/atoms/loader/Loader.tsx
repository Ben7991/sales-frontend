import css from "./Loader.module.css";

export function Loader(): React.JSX.Element {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className={css.loader} />
    </div>
  );
}
