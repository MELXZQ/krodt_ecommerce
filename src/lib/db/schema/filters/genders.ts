import { pgTable, uuid, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from '../products';

export const genders = pgTable('genders', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label', { length: 64 }).notNull(),
  slug: varchar('slug', { length: 64 }).notNull(),
});

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));
