export function makeFirstLetterUppercase(value?: string): string {
  if (!value) return "";

  return `
    ${value.substring(0, 1).toUpperCase()}${value.substring(1).toLowerCase()}
  `;
}
