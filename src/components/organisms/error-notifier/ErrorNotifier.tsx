import { CgDanger } from "react-icons/cg";
import { RiResetLeftFill } from "react-icons/ri";

import { Button } from "@/components/atoms/button/Button";
import { Headline } from "@/components/atoms/headline/Headline";

type ErrorNotifierProps = {
  description: string;
  path: string;
};

export function ErrorNotifier({
  description,
  path,
}: ErrorNotifierProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 md:py-20">
      <CgDanger className="text-4xl text-red-500" />
      <Headline tag="h3" className="mt-3 mb-1">
        Oops!!! An error occurred
      </Headline>
      <p className="mb-4">{description}</p>
      <Button
        el="link"
        to={path}
        variant="primary"
        className="flex! items-center gap-2"
      >
        <RiResetLeftFill />
        Reset
      </Button>
    </div>
  );
}
