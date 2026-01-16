import type { NavLinkRenderProps } from "react-router";

export function rootNavLinkClasses({
  isActive,
  isPending,
}: NavLinkRenderProps): string {
  const rootClasses = "flex items-center gap-2 py-1.5 px-3 rounded-md";

  if (isPending) {
    return `${rootClasses} hover:bg-gray-200`;
  }

  if (isActive) {
    return `${rootClasses} bg-green-700 text-white`;
  }

  return `${rootClasses} hover:bg-gray-200`;
}

export function subNavLinkClasses({
  isActive,
  isPending,
}: NavLinkRenderProps): string {
  const rootClasses =
    "flex items-center gap-2 py-1.5 px-3 hover:bg-gray-200 rounded-md text-[0.875rem]";

  if (isPending) {
    return `${rootClasses}`;
  }

  if (isActive) {
    return `${rootClasses} text-green-700`;
  }

  return `${rootClasses}`;
}

export function isPreferredUrl(
  currentUrl: string,
  preferredUrl: string
): boolean {
  return currentUrl.includes(preferredUrl);
}
