import { PAYMENT_TYPE } from "constants/order";
import { IProductCart } from "./cart";
import { IAddress } from "./user";

export type IProductInvoice = IProductCart

export type IInvoice = {
  products: IProductInvoice[];
  total_invoice?: number;
  total_invoice_discount?: number;
  total_invoice_before_discount?: number;
  address?: IAddress;
  payment_type: PAYMENT_TYPE;
  note?: string;
  voucher_id?: string;
};
