
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductService } from "./product.service.js";
import { ProductController } from "./product.controller.js";
import { Product, ProductSchema } from "../DB/models/product.model.js";
import { Category, categorySchema } from "../DB/models/category.model.js";
import { Brand, brandSchema, } from "../DB/models/brand.model.js";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: categorySchema },
      { name: Brand.name, schema: brandSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
