import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema({
  _id: false,
})
export class CartItem {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Product",
    required: true,
  })
  product: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  pricePerUnit: number;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  subTotal: number;
}

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  })
  user: string;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @Prop({
    type: "Number",
    required: true,
    min: 0,
  })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

export type HCartDocument = HydratedDocument<Cart>;

export const CarModel = MongooseModule.forFeature([
  {
    name: Cart.name,
    schema: CartSchema ,
  },
]);
