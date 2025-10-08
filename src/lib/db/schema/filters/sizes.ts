import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productVariants } from '../variants';

export const sizes = pgTable('sizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 32 }).notNull(),
  slug: varchar('slug', { length: 32 }).notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const sizesRelations = relations(sizes, ({ many }) => ({
  variants: many(productVariants),
}));
