import { GoArrowLeft } from "react-icons/go";

import { Button } from "@/components/atoms/button/Button";
import { Headline } from "@/components/atoms/headline/Headline";

export type GoBackProps = {
  path: string;
  className?: string;
};

export function GoBack({ path, className }: GoBackProps): React.JSX.Element {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button el="link" variant="outline" to={path}>
        <GoArrowLeft />
      </Button>
      <Headline tag="h5">Go back</Headline>
    </div>
  );
}
