type BackdropProps = {
  onToggle: VoidFunction;
};

export function Backdrop({ onToggle }: BackdropProps): React.JSX.Element {
  return (
    <div
      onClick={onToggle}
      className="fixed top-0 left-0 w-full h-screen backdrop-blur-sm bg-black/50 z-2"
    />
  );
}
