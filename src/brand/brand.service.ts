import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBrandDto } from "./dto/create-brand.dto.js";
import { UpdateBrandDto } from "./dto/update-brand.dto.js";
import { InjectModel } from "@nestjs/mongoose";
import { Brand, HBrandDocument } from "../DB/models/brand.model.js";
import { Model, Types } from "mongoose";
import { Category, HcCategoryDocument } from "../DB/models/category.model.js";
import e from "express";

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private readonly _brandModel: Model<HBrandDocument>,
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<HcCategoryDocument>,
  ) {}
  async create(
    createBrandDto: CreateBrandDto,
    logoUrl: string,
    adminId: string,
  ) {
    const existingCount = await this._categoryModel.countDocuments({
      _id: { $in: createBrandDto.categories },
    });
    if (existingCount !== createBrandDto.categories.length)
      throw new BadGatewayException(
        `Database Integrity Failure: One Or more provided IDs do not exists ins db`,
      );
  }

  async update(id: Types.ObjectId, updateBrandDto: UpdateBrandDto, logoUrl?: string) {
    if (!updateBrandDto.categories) return;
    const existingCount = await this._categoryModel.countDocuments({
      _id: { $in: updateBrandDto.categories },
    });
    if (existingCount !== updateBrandDto?.categories.length)
      throw new BadGatewayException(
        `Database Integrity Failure: One Or more provided IDs do not exists ins db`,
      );
    const updatedPayload: any = { ...updateBrandDto };
    if (logoUrl) updatedPayload.logo = logoUrl;

    const updatedBrand = await this._brandModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { returnDocument: `after` },
    );

    if (updatedPayload)
      throw new NotFoundException(`Brand with ID ${id} not found.`);

    return updatedBrand;
  }

  findAll() {
    return this._brandModel
      .find()
      .populate("categories", "name logo")
      .populate("createdBy", "firstName lastName email");
  }

  async findOne(id: Types.ObjectId) {
    const brand = await this._brandModel
      .findById(id)
      .populate(`categories`, `name logo`)
      .populate(`createdBy`, `firstName lastName email`);
    if (!brand) throw new NotFoundException(`Brand with ID ${id} not found.`);

    return brand;
  }
}
