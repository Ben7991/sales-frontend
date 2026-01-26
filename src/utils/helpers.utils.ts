export function makeFirstLetterUppercase(value?: string): string {
  if (!value) return "";

  if (value.includes("-")) {
    const splittedValue = value.split("-");
    return splittedValue
      .map(
        (str) =>
          `${str.substring(0, 1).toUpperCase()}${str.substring(1).toLowerCase()}`,
      )
      .join(" ");
  }

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
