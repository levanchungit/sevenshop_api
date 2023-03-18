import { IProductCart, ProductCart } from "./cart";

export type IProductOrder = IProductCart & {
  total_before_discount: number | undefined;
  total_discount: number | undefined;
  total: number | undefined;
};

export const ProductOrder = ProductCart;
