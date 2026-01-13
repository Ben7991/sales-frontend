type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadlineProps = {
  tag: Tag;
  children: React.ReactNode;
  className?: string;
};
