import mongoose, { Document, model, Schema } from "mongoose";
/*********************TYPE & INTERFACE*****************************/

export interface IProduct extends Document {
  name: string;
  price: number;
  price_sale: number;
  description: string;
  images: string[];
  active: boolean;
  storage_quantity: number;
  properties_type: [
    {
      color_id: mongoose.Types.ObjectId;
      size_id: mongoose.Types.ObjectId;
      quantity: number;
    }
  ];
  categories_type: string;
  create_at: string;
  create_by: string;
  modify_at: string;
  modify_by: string;
}

/*******************************SCHEMA*****************************/

const productSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  price_sale: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  storage_quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  properties_type: [
    {
      color_id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      size_id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  categories_type: {
    type: String,
    required: true,
  },
  create_at: {
    type: String,
    required: true,
  },
  create_by: {
    type: String,
    required: true,
  },
  modify_at: {
    type: String,
  },
  modify_by: {
    type: String,
  },
});

const Product = model<IProduct>("Product", productSchema);

export default Product;
