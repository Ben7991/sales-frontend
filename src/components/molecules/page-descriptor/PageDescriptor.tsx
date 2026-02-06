import { Spinner } from "@/components/atoms/spinner/Spinner";
import type { PageDescriptorProps } from "./PageDescriptor.types";
import { Headline } from "@/components/atoms/headline/Headline";

export function PageDescriptor({
  title,
  description,
  children,
  spinnerState,
}: PageDescriptorProps): React.JSX.Element {
  return (
    <div className="w-full mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <div className="space-y-1">
          <Headline tag="h4">{title}</Headline>
          {description && <p>{description}</p>}
        </div>
        {spinnerState && <Spinner size="sm" color="black" />}
      </div>
      <div className="grow flex flex-col items-start md:flex-row md:items-center md:justify-end gap-2 ">
        {children}
      </div>
    </div>
  );
}
