'use server';

import { db } from '@/lib/db';
import {
  products,
  productVariants,
  productImages,
  categories,
  brands,
  genders,
  colors,
  sizes,
} from '@/lib/db/schema';
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  gte,
  lte,
  sql,
} from 'drizzle-orm';

export type ProductListParams = {
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

export type ProductCardDTO = {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  gender: string | null;
  minPrice: number;
  maxPrice: number;
  imageUrl: string | null;
  createdAt: Date | null;
};

export type GetAllProductsResult = {
  products: ProductCardDTO[];
  totalCount: number;
};

function getOrder(sortBy?: ProductListParams['sortBy']) {
  switch (sortBy) {
    case 'price_asc':
      return asc(sql<number>`min_price`);
    case 'price_desc':
      return desc(sql<number>`max_price`);
    case 'latest':
    default:
      return desc(products.createdAt);
  }
}

export async function getAllProducts(params: ProductListParams): Promise<GetAllProductsResult> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(60, Math.max(1, params.limit ?? 24));
  const offset = (page - 1) * limit;

  const brandSlugs = params.brand && params.brand.length ? params.brand : undefined;
  const categorySlugs = params.category && params.category.length ? params.category : undefined;
  const genderSlugs = params.gender && params.gender.length ? params.gender : undefined;
  const colorSlugs = params.color && params.color.length ? params.color : undefined;
  const sizeSlugs = params.size && params.size.length ? params.size : undefined;

  const baseFilters = [
    eq(products.isPublished, true),
    params.search ? ilike(products.name, `%${params.search}%`) : undefined,
    brandSlugs
      ? inArray(
          products.brandId,
          db
            .select({ id: brands.id })
            .from(brands)
            .where(inArray(brands.slug, brandSlugs)),
        )
      : undefined,
    categorySlugs
      ? inArray(
          products.categoryId,
          db
            .select({ id: categories.id })
            .from(categories)
            .where(inArray(categories.slug, categorySlugs)),
        )
      : undefined,
    genderSlugs
      ? inArray(
          products.genderId,
          db
            .select({ id: genders.id })
            .from(genders)
            .where(inArray(genders.slug, genderSlugs)),
        )
      : undefined,
  ].filter(Boolean) as any[];

  const variantFilters = [
    colorSlugs
      ? inArray(
          productVariants.colorId,
          db
            .select({ id: colors.id })
            .from(colors)
            .where(inArray(colors.slug, colorSlugs)),
        )
      : undefined,
    sizeSlugs
      ? inArray(
          productVariants.sizeId,
          db
            .select({ id: sizes.id })
            .from(sizes)
            .where(inArray(sizes.slug, sizeSlugs)),
        )
      : undefined,
    params.priceMin !== undefined ? gte(productVariants.price, params.priceMin) : undefined,
    params.priceMax !== undefined ? lte(productVariants.price, params.priceMax) : undefined,
  ].filter(Boolean) as any[];

  const whereExpr =
    variantFilters.length > 0 ? and(...baseFilters, and(...variantFilters)) : and(...baseFilters);

  const [{ total }] = await db
    .select({
      total: sql<number>`count(distinct ${products.id})`,
    })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .where(whereExpr);

  const orderExpr = getOrder(params.sortBy);

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      brand: brands.name,
      category: categories.name,
      gender: genders.label,
      createdAt: products.createdAt,
      minPrice: sql<number>`min(${productVariants.price})`,
      maxPrice: sql<number>`max(${productVariants.price})`,
      colorImage: colorSlugs
        ? sql<string | null>`
          (select pi.url
           from ${productImages} pi
           where pi.product_id = ${products.id}
             and pi.variant_id is not null
           order by pi.is_primary desc, pi.sort_order asc
           limit 1)`
        : sql<string | null>`null`,
      genericImage: !colorSlugs
        ? sql<string | null>`
          (select pi2.url
           from ${productImages} pi2
           where pi2.product_id = ${products.id}
           order by pi2.is_primary desc, pi2.sort_order asc
           limit 1)`
        : sql<string | null>`null`,
    })
    .from(products)
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .where(whereExpr)
    .groupBy(products.id, brands.name, categories.name, genders.label)
    .orderBy(orderExpr)
    .limit(limit)
    .offset(offset);

  const result: ProductCardDTO[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    brand: r.brand ?? null,
    category: r.category ?? null,
    gender: r.gender ?? null,
    minPrice: Number(r.minPrice ?? 0),
    maxPrice: Number(r.maxPrice ?? 0),
    imageUrl: r.colorImage ?? r.genericImage ?? null,
    createdAt: r.createdAt ?? null,
  }));

  return { products: result, totalCount: Number(total ?? 0) };
}

export type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  brand: { id: string; name: string; slug: string | null };
  category: { id: string; name: string; slug: string | null };
  gender: { id: string; label: string; slug: string | null };
  variants: Array<{
    id: string;
    sku: string;
    price: number;
    salePrice: number | null;
    inStock: number;
    size: { id: string; name: string; slug: string | null };
    color: { id: string; name: string; slug: string | null; hexCode: string };
    images: string[];
  }>;
  images: string[];
  createdAt: Date | null;
};

export async function getProduct(productId: string): Promise<ProductDetail | null> {
  const [p] = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      createdAt: products.createdAt,
      brandId: products.brandId,
      categoryId: products.categoryId,
      genderId: products.genderId,
      brandName: brands.name,
      brandSlug: brands.slug,
      categoryName: categories.name,
      categorySlug: categories.slug,
      genderLabel: genders.label,
      genderSlug: genders.slug,
    })
    .from(products)
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .where(eq(products.id, productId))
    .limit(1);

  if (!p) return null;

  const variantRows = await db
    .select({
      variantId: productVariants.id,
      sku: productVariants.sku,
      price: productVariants.price,
      salePrice: productVariants.salePrice,
      inStock: productVariants.inStock,
      sizeId: sizes.id,
      sizeName: sizes.name,
      sizeSlug: sizes.slug,
      colorId: colors.id,
      colorName: colors.name,
      colorSlug: colors.slug,
      colorHex: colors.hexCode,
      imageUrl: productImages.url,
    })
    .from(productVariants)
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(productImages, eq(productImages.variantId, productVariants.id))
    .where(eq(productVariants.productId, productId));

  const variantMap = new Map<string, ProductDetail['variants'][number]>();
  for (const row of variantRows) {
    if (!variantMap.has(row.variantId)) {
      variantMap.set(row.variantId, {
        id: row.variantId,
        sku: row.sku,
        price: Number(row.price),
        salePrice: row.salePrice ? Number(row.salePrice) : null,
        inStock: row.inStock,
        size: { id: row.sizeId, name: row.sizeName, slug: row.sizeSlug },
        color: {
          id: row.colorId,
          name: row.colorName,
          slug: row.colorSlug,
          hexCode: row.colorHex,
        },
        images: [],
      });
    }
    if (row.imageUrl) {
      variantMap.get(row.variantId)!.images.push(row.imageUrl);
    }
  }

  const genericImagesRows = await db
    .select({ url: productImages.url })
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder));

  return {
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    createdAt: p.createdAt ?? null,
    brand: { id: p.brandId, name: p.brandName, slug: p.brandSlug },
    category: { id: p.categoryId, name: p.categoryName, slug: p.categorySlug },
    gender: { id: p.genderId, label: p.genderLabel, slug: p.genderSlug },
    variants: Array.from(variantMap.values()),
    images: genericImagesRows.map((i) => i.url),
  };
}
