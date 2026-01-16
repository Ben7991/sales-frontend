import type { PageDescriptorProps } from "./PageDescriptor.types";
import { Headline } from "@/components/atoms/headline/Headline";

export function PageDescriptor({
  title,
  description,
}: PageDescriptorProps): React.JSX.Element {
  return (
    <div className="space-y-1 mb-4 lg:mb-6 xl:mb-8">
      <Headline tag="h4">{title}</Headline>
      <p>{description}</p>
    </div>
  );
}
