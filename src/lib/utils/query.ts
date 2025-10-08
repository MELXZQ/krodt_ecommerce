import qs from 'query-string';
import { and, or, ilike, inArray, sql, desc, asc, eq } from 'drizzle-orm';
import {
  products,
  productVariants,
  brands,
  categories,
  genders,
  sizes,
  colors,
} from '@/lib/db/schema';
import type { SQLWrapper } from 'drizzle-orm';


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

export type ParsedFilters = {
  search?: string;
  brand?: string[];
  category?: string[];
  gender?: string[];
  color?: string[];
  size?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'featured' | 'newest' | 'price_desc' | 'price_asc';
  page?: number;
  limit?: number;
  isPublished?: boolean;
};

export function parseFilterParams(input: Record<string, unknown>): ParsedFilters {
  const arr = (v: unknown) => normalizeToArray(v);
  const num = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : Number(v));
  const str = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : String(v));

  return {
    search: str(input.search),
    brand: arr(input.brand),
    category: arr(input.category),
    gender: arr(input.gender),
    color: arr(input.color),
    size: arr(input.size),
    priceMin: num(input.priceMin),
    priceMax: num(input.priceMax),
    sortBy: (str(input.sortBy) as ParsedFilters['sortBy']) || 'newest',
    page: num(input.page) || 1,
    limit: Math.min(num(input.limit) || 24, 48),
    isPublished: input.isPublished === undefined ? true : String(input.isPublished) === 'true',
  };
}

export function buildProductQueryObject(filters: ParsedFilters) {
  const whereClauses: SQLWrapper[] = [];

  if (filters.isPublished !== false) {
    whereClauses.push(eq(products.isPublished, true));
  }

  if (filters.search) {
    const like = `%${filters.search}%`;
    whereClauses.push(
      sql`(${ilike(products.name, like)} OR ${ilike(products.description, like)} OR ${ilike(brands.name, like)} OR ${ilike(categories.name, like)})`
    );
  }

  if (filters.brand?.length) whereClauses.push(inArray(brands.slug, filters.brand));
  if (filters.category?.length) whereClauses.push(inArray(categories.slug, filters.category));
  if (filters.gender?.length) whereClauses.push(inArray(genders.slug, filters.gender));
  if (filters.color?.length) whereClauses.push(inArray(colors.slug, filters.color));
  if (filters.size?.length) whereClauses.push(inArray(sizes.slug, filters.size));

  if (filters.priceMin !== undefined) {
    whereClauses.push(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price}) >= ${filters.priceMin}`);
  }
  if (filters.priceMax !== undefined) {
    whereClauses.push(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price}) <= ${filters.priceMax}`);
  }

  const orderBy = (() => {
    switch (filters.sortBy) {
      case 'price_asc':
        return [asc(sql`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`)];
      case 'price_desc':
        return [desc(sql`MAX(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`)];
      case 'newest':
      default:
        return [desc(products.createdAt)];
    }
  })();

  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(filters.limit || 24, 48);
  const offset = (page - 1) * limit;

  const colorFilterApplied = !!(filters.color && filters.color.length);

  return {
    where: whereClauses.length ? and(...whereClauses) : undefined,
    orderBy,
    limit,
    offset,
    colorFilterApplied,
  };
}
