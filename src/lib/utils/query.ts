import qs from 'query-string';

type Primitive = string | number | boolean | null | undefined;
type QueryValue = Primitive | Primitive[];
export type QueryObject = Record<string, unknown>;

export function parseQuery(input: string): QueryObject {
  const str = input.startsWith('?') ? input : `?${input}`;
  const parsed = qs.parse(str, { parseBooleans: true, parseNumbers: false }) as QueryObject;
  for (const k in parsed) {
    const v = parsed[k];
    if (typeof v === 'string' && v.includes(',')) {
      parsed[k] = v.split(',').filter(Boolean);
    }
  }
  return parsed;
}

export function stringifyQuery(params: QueryObject): string {
  const q = qs.stringify(params as qs.StringifiableRecord, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
    encode: false,
    sort: false,
  });
  return q ? `?${q}` : '';
}

export function toggleListParam(params: QueryObject, key: string, value: string): QueryObject {
  const current = normalizeToArray(params[key]);
  const exists = current.includes(value);
  const next = exists ? current.filter((v) => v !== value) : [...current, value];
  const updated: QueryObject = { ...params };
  if (next.length) updated[key] = next;
  else delete updated[key as keyof QueryObject];
  return updated;
}

export function setParam(params: QueryObject, key: string, value: QueryValue): QueryObject {
  const updated: QueryObject = { ...params };
  if (value === null || value === undefined || value === '') delete updated[key as keyof QueryObject];
  else updated[key] = value;
  return updated;
}

export function removeParam(params: QueryObject, key: string): QueryObject {
  const updated: QueryObject = { ...params };
  delete updated[key as keyof QueryObject];
  return updated;
}

export function resetPagination(params: QueryObject): QueryObject {
  const updated: QueryObject = { ...params };
  delete updated.page;
  return updated;
}

export function normalizeToArray(v: unknown): string[] {
  if (v === undefined || v === null || v === '') return [];
  if (Array.isArray(v)) return v.map(String);
  return String(v).split(',').filter(Boolean);
}

export type SortKey = 'featured' | 'newest' | 'price_desc' | 'price_asc';

type Sortable = { price: number; createdAt?: Date };

export function getSortComparator(sort: SortKey) {
  switch (sort) {
    case 'price_desc':
      return (a: Sortable, b: Sortable) => b.price - a.price;
    case 'price_asc':
      return (a: Sortable, b: Sortable) => a.price - b.price;
    case 'newest':
      return (a: Sortable, b: Sortable) =>
        (b.createdAt?.valueOf() ?? 0) - (a.createdAt?.valueOf() ?? 0);
    default:
      return () => 0;
  }
}
export type FilterParams = {
  search?: string;
  brand?: string[];
  category?: string[];
  gender?: string[];
  color?: string[];
  size?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'latest' | 'featured';
  page?: number;
  limit?: number;
};

export function parseFilterParams(raw: URLSearchParams | Record<string, string | string[] | undefined>): FilterParams {
  const toArr = (v: unknown) => {
    if (!v) return [];
    if (Array.isArray(v)) return v.map(String);
    return String(v).split(',').filter(Boolean);
  };
  const get = (k: string) =>
    raw instanceof URLSearchParams ? raw.get(k) : (raw as Record<string, string | string[] | undefined>)[k];

  const brand = toArr(get('brand') as unknown);
  const category = toArr(get('category') as unknown);
  const gender = toArr(get('gender') as unknown);
  const color = toArr(get('color') as unknown);
  const size = toArr(get('size') as unknown);
  const search = (get('search') as string) || undefined;
  const sortBy = ((get('sortBy') as string) || 'latest') as FilterParams['sortBy'];
  const page = Number(get('page') ?? 1) || 1;
  const limit = Number(get('limit') ?? 24) || 24;

  const priceMin = get('priceMin') ? Number(get('priceMin')) : undefined;
  const priceMax = get('priceMax') ? Number(get('priceMax')) : undefined;

  return {
    search,
    brand: brand.length ? brand : undefined,
    category: category.length ? category : undefined,
    gender: gender.length ? gender : undefined,
    color: color.length ? color : undefined,
    size: size.length ? size : undefined,
    priceMin,
    priceMax,
    sortBy,
    page,
    limit,
  };
}

export function buildProductQueryObject(fp: FilterParams) {
  return fp;
}
