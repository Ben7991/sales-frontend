import { Headline } from "@/components/atoms/headline/Headline";

type SectionWrapperProps = {
  heading: string;
  children: React.ReactNode;
};

export function SectionWrapper({ heading, children }: SectionWrapperProps) {
  return (
    <div className="bg-white p-3 xl:p-4 border border-gray-200 rounded-md mb-4">
      <Headline tag="h5" className="mb-4">
        {heading}
      </Headline>
      {children}
    </div>
  );
}
