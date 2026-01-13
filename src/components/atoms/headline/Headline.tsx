import type { HeadlineProps } from "./Headline.types";

export function Headline({
  tag,
  className,
  children,
}: HeadlineProps): React.JSX.Element {
  switch (tag) {
    case "h1":
      return (
        <h1 className={`text-[2rem] font-semibold ${className}`}>{children}</h1>
      );
    case "h2":
      return (
        <h2 className={`text-[1.75rem] font-semibold ${className}`}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className={`text-2xl font-semibold ${className}`}>{children}</h3>
      );
    case "h4":
      return (
        <h4 className={`text-xl font-semibold ${className}`}>{children}</h4>
      );
    case "h5":
      return <h5 className={`font-semibold ${className}`}>{children}</h5>;
    case "h6":
      return (
        <h6 className={`text-[0.75rem] font-semibold ${className}`}>
          {children}
        </h6>
      );
  }
}
