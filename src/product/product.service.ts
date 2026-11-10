
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto.js";
import { UpdateProductDto } from "./dto/update-product.dto.js";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  HProductDocument,
  Product,
} from "../DB/models/product.model.js";
import {
  Category,
  HcCategoryDocument,
} from "../DB/models/category.model.js";
import {
  Brand,
  HBrandDocument,
} from "../DB/models/brand.model.js";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly _productModel: Model<HProductDocument>,

    @InjectModel(Category.name)
    private readonly _categoryModel: Model<HcCategoryDocument>,

    @InjectModel(Brand.name)
    private readonly _brandModel: Model<HBrandDocument>,
  ) {}

  private async validateBrandCategoryRelationship(
    brandId: string,
    categoryId: string,
  ): Promise<void> {
    const brand = await this._brandModel.findById(brandId);

    if (!brand) {
      throw new NotFoundException("The assigned brand does not exist");
    }

    const supportedCategoryIds = brand.categories.map((id) =>
      id.toString(),
    );

    if (!supportedCategoryIds.includes(categoryId)) {
      throw new BadRequestException(
        `Business rule: the brand ${brand.name} does not support this category`,
      );
    }

    const category = await this._categoryModel.findById(categoryId);

    if (!category) {
      throw new NotFoundException("The assigned category does not exist");
    }
  }

  async create(
    createProductDto: CreateProductDto,
    imageUrl: string[],
    adminId: Types.ObjectId,
  ) {
    await this.validateBrandCategoryRelationship(
      createProductDto.brand,
      createProductDto.category,
    );

    return this._productModel.create({
      ...createProductDto,
      image: imageUrl,
      createdBy: adminId,
    });
  }

  findAll() {
    return this._productModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
