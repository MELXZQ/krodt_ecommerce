import { pgTable, uuid, varchar, numeric, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 64 }).notNull().unique(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value').notNull(),
  expiresAt: timestamp('expires_at'),
  maxUsage: integer('max_usage').notNull().default(0),
  usedCount: integer('used_count').notNull().default(0),
});
