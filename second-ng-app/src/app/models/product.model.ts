// Интерфейс для варианта товара (цвет, размер, остаток)
export interface ProductVariant {
  id: number;
  color: string;
  size: string;
  stock: number;
  sku?: string;
  variantImage?: string;
}

// Интерфейс для создателя товара (пользователя)
export interface User {
  id: string;
  userName: string;
  email: string;
  avatarPath?: string;
}

// Основной интерфейс продукта
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  baseImage: string;
  createdAt: Date;
  updatedAt: Date;
  // Связи
  user: User; 
  variants: ProductVariant[];
}