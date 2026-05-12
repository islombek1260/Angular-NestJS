export interface ProductVariant {
  id?: string;
  color: string;
  size: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  baseImage: string;
  variants: ProductVariant[];
  userId: string;
  createdAt: Date;
}