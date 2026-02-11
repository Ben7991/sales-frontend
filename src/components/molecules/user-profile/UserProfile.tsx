import { Headline } from "@/components/atoms/headline/Headline";
import { useAppSelector } from "@/store/index.util";

type UserProfileProps = {
  className?: string;
};

export function UserProfile({
  className,
}: UserProfileProps): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="w-12 h-12 rounded-md border border-gray-400 flex items-center justify-center text-xl">
        BT
      </div>
      <div>
        <Headline tag="h5">{user?.name}</Headline>
        <p className="text-[0.875rem]">{user?.role.split("_").join(" ")}</p>
      </div>
    </div>
  );
}
