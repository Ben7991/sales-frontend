type ProductCardProps = {
  imagePath?: string;
  name: string;
};

export function ProductCard({
  name,
  imagePath,
}: ProductCardProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      {imagePath ? (
        <img
          className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden"
          src={`${import.meta.env.VITE_BASE_API_URL}/${imagePath}`}
        />
      ) : (
        <span className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
          ?
        </span>
      )}
      <span>{name}</span>
    </div>
  );
}
