import { Headline } from "@/components/atoms/headline/Headline";
import type { AuthLayoutProps } from "./Auth.types";

export function AuthDescriptor({
  title,
  description,
}: Pick<AuthLayoutProps, "title" | "description">): React.JSX.Element {
  return (
    <div className="space-y-2 mb-4">
      <Headline tag="h4">{title}</Headline>
      <p>{description}</p>
    </div>
  );
}
