import {foreignKey, pgTable, uuid, varchar} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 128 }).notNull(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  parentId: uuid('parent_id'),
}, (t) => ({
    parentFk: foreignKey({
        columns: [t.parentId],
        foreignColumns: [t.id],
    }).onDelete('set null'),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  children: many(categories),
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
}));
