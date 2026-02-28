import { AiOutlineExclamationCircle } from "react-icons/ai";

type InfoProps = {
  children: React.ReactNode;
  className?: string;
};

export function Info({ className, children }: InfoProps): React.JSX.Element {
  return (
    <div className={`flex gap-2 items-start ${className}`}>
      <div className="w-6 h-6">
        <AiOutlineExclamationCircle className="text-2xl" />
      </div>
      <div>{children}</div>
    </div>
  );
}
