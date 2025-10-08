import { z } from 'zod';
import { addressTypeEnum } from './addresses';
import { orderStatusEnum } from './orders';
import { paymentMethodEnum, paymentStatusEnum } from './payments';
import { discountTypeEnum } from './coupons';

export const addressInsertSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(addressTypeEnum.enumValues),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  isDefault: z.boolean().optional(),
});

export const productInsertSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean().optional(),
  defaultVariantId: z.string().uuid().nullable().optional(),
});

export const productVariantInsertSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  salePrice: z.coerce.number().nonnegative().optional(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
  dimensions: z.object({ length: z.number(), width: z.number(), height: z.number() }).optional(),
});

export const imageInsertSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable().optional(),
  url: z.string().url(),
  sortOrder: z.number().int().nonnegative().optional(),
  isPrimary: z.boolean().optional(),
});

export const reviewInsertSchema = z.object({
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const cartInsertSchema = z.object({
  userId: z.string().uuid().nullable().optional(),
  guestId: z.string().optional(),
});

export const cartItemInsertSchema = z.object({
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const orderInsertSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(orderStatusEnum.enumValues).optional(),
  totalAmount: z.coerce.number().nonnegative(),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
});

export const orderItemInsertSchema = z.object({
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  priceAtPurchase: z.coerce.number().nonnegative(),
});

export const paymentInsertSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(paymentMethodEnum.enumValues),
  status: z.enum(paymentStatusEnum.enumValues).optional(),
  paidAt: z.date().optional(),
  transactionId: z.string().optional(),
});

export const couponInsertSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(discountTypeEnum.enumValues),
  discountValue: z.coerce.number().nonnegative(),
  expiresAt: z.date().optional(),
  maxUsage: z.number().int().nonnegative().optional(),
  usedCount: z.number().int().nonnegative().optional(),
});

export const wishlistInsertSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
});

export const genderInsertSchema = z.object({
  label: z.string().min(1),
  slug: z.string().min(1),
});

export const brandInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export const colorInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const sizeInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int().nonnegative().optional(),
});

export const categoryInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().uuid().nullable().optional(),
});

export const collectionInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});
