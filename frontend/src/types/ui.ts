import type { Product } from '../models';

export type CartLine = { product: Product; qty: number };

export type ProductForm = {
  name: string;
  categoryId: number;
  price: number;
  defaultDiscount: number;
};

export const defaultProductForm: ProductForm = {
  name: '',
  categoryId: 0,
  price: 0,
  defaultDiscount: 0
};
