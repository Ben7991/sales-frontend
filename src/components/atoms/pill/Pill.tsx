type PillVariant = "success" | "danger" | "secondary" | "warning" | "primary";
type PillProps = {
  variant: PillVariant;
  text: string;
};

export function Pill({ text, variant }: PillProps): React.JSX.Element {
  let variantClasses = "bg-green-100 text-green-700";

  if (variant === "danger") {
    variantClasses = "bg-red-100 text-red-700";
  } else if (variant === "secondary") {
    variantClasses = "bg-gray-100 text-gray-700";
  } else if (variant === "warning") {
    variantClasses = "bg-yellow-100 text-yellow-700";
  } else if (variant === "primary") {
    variantClasses = "bg-blue-100 text-blue-700";
  }

  return (
    <span className={`py-1 px-2 text-[0.80rem] rounded-full ${variantClasses}`}>
      {text}
    </span>
  );
}
