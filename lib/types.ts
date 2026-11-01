export type Variant = {
  id: string;
  name: string;
  value: string;
  priceDelta: number;
  stock: number;
  sku?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  categorySlug: string;
  categoryName: string;
  featured: boolean;
  stock: number;
  badge?: string | null;
  variants: Variant[];
};

export type CartLine = {
  product: Product;
  variant: Variant;
  quantity: number;
};

export type OrderStatus = "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";

export type AdminOrder = {
  id: string;
  order_number: number;
  status: OrderStatus;
  total: number;
  subtotal: number;
  discount_amount: number;
  created_at: string;
  customer: { full_name: string; email: string; phone: string } | null;
  order_items: { product_name: string; variant_name: string; variant_value: string; quantity: number; line_total: number }[];
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  active: boolean;
  featured: boolean;
  stock: number;
  category_id: string;
  description: string;
  subtitle: string;
};
