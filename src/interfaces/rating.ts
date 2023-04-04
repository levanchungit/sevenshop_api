import { IModify } from "./basic";

export type IRatingResult = {
  product_id: string;
  product_image: string;
  product_name: string;
  size_id: string;
  size_name: string;
  color_id: string;
  color_name: string;
  quantity: number;
};

export type IRateResult = {
  user_id: string;
  avatar: string;
  size_id: string;
  size: string;
  color_id: string;
  color_code: string;
  images: string[];
  content: string;
  rating: number;
  modify: IModify;
};
