import { pgTable, uuid, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orders } from './orders';

export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'paypal', 'cod']);
export const paymentStatusEnum = pgEnum('payment_status', ['initiated', 'completed', 'failed']);

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').notNull().default('initiated'),
  paidAt: timestamp('paid_at'),
  transactionId: text('transaction_id'),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));
