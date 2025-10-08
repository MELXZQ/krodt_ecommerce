'use server';

import { db } from '@/lib/db';
import {
  products,
  productVariants,
  productImages,
  brands,
  categories,
  genders,
  sizes,
  colors,
} from '@/lib/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { buildProductQueryObject, ParsedFilters } from '@/lib/utils/query';

export type ProductListItem = {
  id: string;
  name: string;
  description: string | null;
  brandName: string | null;
  categoryName: string | null;
  genderSlug: string | null;
  minPrice: number;
  maxPrice: number;
  imageUrl: string | null;
  createdAt: Date | null;
};

export type GetAllProductsResult = {
  products: ProductListItem[];
  totalCount: number;
};

export async function getAllProducts(params: ParsedFilters): Promise<GetAllProductsResult> {
  const { where, orderBy, limit, offset, colorFilterApplied } = buildProductQueryObject(params);

  const topImage = db
    .select({
      productId: productImages.productId,
      url: sql<string>`(array_agg(${productImages.url} ORDER BY ${productImages.isPrimary} DESC, ${productImages.sortOrder} ASC))[1]`.as('url'),
    })
    .from(productImages)
    .where(
      colorFilterApplied
        ? sql`${productImages.variantId} IS NOT NULL`
        : sql`${productImages.variantId} IS NULL`
    )
    .groupBy(productImages.productId)
    .as('top_image');

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      brandName: brands.name,
      categoryName: categories.name,
      genderSlug: genders.slug,
      minPrice: sql<number>`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`,
      maxPrice: sql<number>`MAX(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`,
      imageUrl: topImage.url,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(genders, eq(products.genderId, genders.id))
    .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .leftJoin(colors, eq(productVariants.colorId, colors.id))
    .leftJoin(topImage, eq(topImage.productId, products.id))
    .where(where)
    .groupBy(
      products.id,
      brands.name,
      categories.name,
      genders.slug,
      topImage.url
    )
    .orderBy(...orderBy)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${products.id})`,
    })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(genders, eq(products.genderId, genders.id))
    .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .leftJoin(colors, eq(productVariants.colorId, colors.id))
    .where(where);

  return { products: rows.map(r => ({ ...r, minPrice: Number(r.minPrice), maxPrice: Number(r.maxPrice) })), totalCount: Number(count) };
}

export type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  brand: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string } | null;
  gender: { id: string; slug: string; label: string } | null;
  variants: Array<{
    id: string;
    sku: string;
    price: number;
    salePrice: number | null;
    size: { id: string; name: string; slug: string } | null;
    color: { id: string; name: string; slug: string; hexCode: string } | null;
    inStock: number;
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
      brandId: brands.id,
      brandName: brands.name,
      brandSlug: brands.slug,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      genderId: genders.id,
      genderSlug: genders.slug,
      genderLabel: genders.label,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(genders, eq(products.genderId, genders.id))
    .where(eq(products.id, productId));

  if (!p) return null;

  const variantRows = await db
    .select({
      id: productVariants.id,
      sku: productVariants.sku,
      price: productVariants.price,
      salePrice: productVariants.salePrice,
      sizeId: sizes.id,
      sizeName: sizes.name,
      sizeSlug: sizes.slug,
      colorId: colors.id,
      colorName: colors.name,
      colorSlug: colors.slug,
      colorHex: colors.hexCode,
      inStock: productVariants.inStock,
    })
    .from(productVariants)
    .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .leftJoin(colors, eq(productVariants.colorId, colors.id))
    .where(eq(productVariants.productId, productId));

  const variantIds = variantRows.map(v => v.id);
  const variantImages = variantIds.length
    ? await db
        .select({
          variantId: productImages.variantId,
          url: productImages.url,
        })
        .from(productImages)
        .where(inArray(productImages.variantId, variantIds))
    : [];

  const genericImages = await db
    .select({ url: productImages.url })
    .from(productImages)
    .where(and(eq(productImages.productId, productId), sql`${productImages.variantId} IS NULL`));

  const imagesByVariant = new Map<string, string[]>();
  for (const vi of variantImages) {
    if (!vi.variantId) continue;
    const arr = imagesByVariant.get(vi.variantId) ?? [];
    arr.push(vi.url);
    imagesByVariant.set(vi.variantId, arr);
  }

  const result: ProductDetail = {
    id: p.id,
    name: p.name,
    description: p.description,
    brand: p.brandId ? { id: p.brandId, name: p.brandName!, slug: p.brandSlug! } : null,
    category: p.categoryId ? { id: p.categoryId, name: p.categoryName!, slug: p.categorySlug! } : null,
    gender: p.genderId ? { id: p.genderId, slug: p.genderSlug!, label: p.genderLabel! } : null,
    variants: variantRows.map(v => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      salePrice: v.salePrice ? Number(v.salePrice) : null,
      size: v.sizeId ? { id: v.sizeId, name: v.sizeName!, slug: v.sizeSlug! } : null,
      color: v.colorId ? { id: v.colorId, name: v.colorName!, slug: v.colorSlug!, hexCode: v.colorHex! } : null,
      inStock: v.inStock,
      images: imagesByVariant.get(v.id) ?? [],
    })),
    images: genericImages.map(g => g.url),
    createdAt: p.createdAt,
  };

  return result;
}
