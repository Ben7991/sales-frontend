export function makeFirstLetterUppercase(value?: string): string {
  if (!value) return "";

  return `
    ${value.substring(0, 1).toUpperCase()}${value.substring(1).toLowerCase()}
  `;
}

export function getPaginatedData(searchParams: URLSearchParams) {
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage") ?? "";
  const query = searchParams.get("q") ?? "";

  let parsedPage = 1,
    parsedPerPage = 10;

  if (page && !Number.isNaN(parseInt(page))) {
    parsedPage = parseInt(page);
  }

  if (perPage && !Number.isNaN(parseInt(perPage))) {
    parsedPerPage = parseInt(perPage);
  }

  return {
    query,
    page: parsedPage,
    perPage: parsedPerPage,
  };
}
