
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({ type: String, required: true, trim: true, minlength: 2, maxlength: 100 })
  name: string;

  @Prop({ type: String, required: true, maxlength: 5000 })
  description: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Number, default: 0, min: 0 })
  stock: number;

  @Prop({ type: String, required: true })
  image: string[];

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Brand", required: true })
  brand: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type HProductDocument = HydratedDocument<Product>;
