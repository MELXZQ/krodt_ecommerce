import { pgTable, serial, text, decimal, timestamp, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  category: varchar('category', { length: 100 }),
  brand: varchar('brand', { length: 100 }),
  size: varchar('size', { length: 50 }),
  color: varchar('color', { length: 50 }),
  stock: serial('stock').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;