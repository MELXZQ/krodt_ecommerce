import qs from 'query-string';

type Primitive = string | number | boolean | null | undefined;
type QueryValue = Primitive | Primitive[];
export type QueryObject = Record<string, unknown>;

export function parseQuery(input: string): QueryObject {
  const str = input.startsWith('?') ? input : `?${input}`;
  return qs.parse(str, { arrayFormat: 'comma', parseBooleans: true, parseNumbers: false }) as QueryObject;
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

function normalizeToArray(v: unknown): string[] {
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
