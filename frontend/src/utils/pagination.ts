export const POSTS_PER_PAGE = 5;

export function getTotalPages(totalItems: number): number {
  return Math.ceil(totalItems / POSTS_PER_PAGE);
}

export function getPageItems<T>(items: T[], currentPage: number): T[] {
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  return items.slice(startIndex, startIndex + POSTS_PER_PAGE);
}

export function getPageWindow(
  currentPage: number,
  totalPages: number,
): number[] {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = currentPage - 1;

  if (start < 1) start = 1;
  if (start + 2 > totalPages) start = totalPages - 2;

  return [start, start + 1, start + 2];
}
