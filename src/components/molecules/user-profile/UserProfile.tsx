import { Headline } from "@/components/atoms/headline/Headline";

type UserProfileProps = {
  className?: string;
};

export function UserProfile({
  className,
}: UserProfileProps): React.JSX.Element {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-xl">
        BT
      </div>
      <div>
        <Headline tag="h5">Bernard Teye</Headline>
        <p className="text-[0.875rem]">ADMIN</p>
      </div>
    </div>
  );
}
