import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";
import { InjectModel } from "@nestjs/mongoose";
import { Category, HcCategoryDocument } from "../DB/models/category.model.js";
import { Model, Types } from "mongoose";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly_categoryModel: Model<HcCategoryDocument>,
  ) {}
  create(
    createCategoryDto: CreateCategoryDto,
    logoUrl: string,
    adminId: Types.ObjectId,
  ) {
    const newCategory = new this.readonly_categoryModel({
      ...createCategoryDto,
      logo: logoUrl,
      createdBy: adminId,
    });
    return newCategory.save();
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    logoUrl?: string,
  ) {
    const updatedPayload: any = { ...updateCategoryDto };
    if (logoUrl) updatedPayload.logo = logoUrl;

    const updatedCategory = await this.readonly_categoryModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { returnDocument: `after` },
    );
    if (!updatedCategory) throw new NotFoundException(`Category not found`);

    return updatedCategory;
  }
}
