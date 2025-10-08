import { pgTable, uuid, varchar, numeric, integer, real, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';
import { productImages } from './images';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: varchar('sku', { length: 64 }).notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id').notNull().references(() => colors.id, { onDelete: 'restrict' }),
  sizeId: uuid('size_id').notNull().references(() => sizes.id, { onDelete: 'restrict' }),
  inStock: integer('in_stock').notNull().default(0),
  weight: real('weight').notNull().default(0),
  dimensions: jsonb('dimensions').$type<{ length: number; width: number; height: number }>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  color: one(colors, { fields: [productVariants.colorId], references: [colors.id] }),
  size: one(sizes, { fields: [productVariants.sizeId], references: [sizes.id] }),
  images: many(productImages),
}));
