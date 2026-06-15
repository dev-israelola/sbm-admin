export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export const DEFAULT_PAGE_SIZE = 20;

export function fallbackMeta(total: number, page = 1, limit = DEFAULT_PAGE_SIZE): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function paginated<T>(
  data: T[] | { items?: T[]; meta?: Partial<PaginationMeta>; total?: number },
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
): PaginatedResponse<T> {
  if (Array.isArray(data)) {
    return { items: data, meta: fallbackMeta(data.length, page, limit) };
  }
  const items = data.items ?? [];
  const total = data.meta?.total ?? data.total ?? items.length;
  return {
    items,
    meta: {
      ...fallbackMeta(total, page, limit),
      ...data.meta,
      total,
      page: data.meta?.page ?? page,
      limit: data.meta?.limit ?? limit,
    },
  };
}
