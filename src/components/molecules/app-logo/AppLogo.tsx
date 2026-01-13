import logo from "@/assets/logo.png";
import { Headline } from "@/components/atoms/headline/Headline";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps): React.JSX.Element {
  return (
    <div className={`flex items-center gap-3 ${className ? className : ""}`}>
      <img src={logo} alt="Jofak Enterprise Logo" className="w-10" />
      <Headline tag="h3">Jofak Enterprise</Headline>
    </div>
  );
}
