import { HiOutlineExclamationCircle } from "react-icons/hi";

type InfoProps = {
  message: string;
};

export function Info({ message }: InfoProps): React.JSX.Element {
  return (
    <div className="flex gap-2 items-start">
      <HiOutlineExclamationCircle className="text-2xl" />
      <p className="m-0">{message}</p>
    </div>
  );
}
