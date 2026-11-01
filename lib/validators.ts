import { z } from "zod";

export const customerSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(3).max(180),
  postal_code: z.string().trim().min(2).max(20),
  city: z.string().trim().min(2).max(100),
  country: z.string().trim().min(2).max(80).default("France"),
});

export const checkoutSchema = z.object({
  customer: customerSchema,
  items: z.array(z.object({ variantId: z.uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(30),
  promoCode: z.string().trim().max(40).optional(),
}).refine((value) => new Set(value.items.map((item) => item.variantId)).size === value.items.length, { message: "Les variantes doivent être uniques dans le panier." });

const variantInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  value: z.string().trim().min(1).max(100),
  price_delta: z.number().min(-100000).max(100000),
  stock: z.number().int().min(0).max(100000),
  sku: z.string().trim().max(80).optional().nullable(),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category_slug: z.string().trim().min(2).max(60),
  subtitle: z.string().trim().max(180).default(""),
  description: z.string().trim().max(3000).default(""),
  price: z.number().min(0).max(100000),
  compare_at_price: z.number().min(0).max(100000).nullable().optional(),
  image_url: z.string().trim().min(1).max(800),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  variants: z.array(variantInputSchema).min(1).max(24),
});

export const promotionInputSchema = z.object({
  code: z.string().trim().min(3).max(40).regex(/^[A-Za-z0-9_-]+$/),
  description: z.string().trim().max(240).default(""),
  discount_type: z.enum(["percent", "fixed"]),
  discount_value: z.number().positive().max(100000),
  active: z.boolean().default(true),
  starts_at: z.iso.datetime().nullable().optional(),
  ends_at: z.iso.datetime().nullable().optional(),
  usage_limit: z.number().int().positive().nullable().optional(),
});
