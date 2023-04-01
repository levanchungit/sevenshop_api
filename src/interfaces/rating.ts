import { IReview } from "./product";
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
  product_id: string;
  ratings: IReview;
};
