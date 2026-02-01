type PillVariant = "success" | "danger" | "secondary";
type PillProps = {
  variant: PillVariant;
  text: string;
};

export function Pill({ text, variant }: PillProps): React.JSX.Element {
  let variantClasses = "bg-green-200 text-green-700";

  if (variant === "danger") {
    variantClasses = "bg-red-200 text-red-700";
  } else if (variant === "secondary") {
    variantClasses = "bg-gray-200 text-gray-700";
  }

  return (
    <span className={`py-1 px-2 text-[0.80rem] rounded-full ${variantClasses}`}>
      {text}
    </span>
  );
}
