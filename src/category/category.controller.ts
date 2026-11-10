import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UploadedFile,
  Req,
  BadGatewayException,
  UseInterceptors,
} from "@nestjs/common";
import { CategoryService } from "./category.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";
import type { Request } from "express";
import { Types } from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../Utils/multer.options.js";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor(`file`, multerOptions))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    if (!file) throw new BadGatewayException(`category logo is required`);

    const logoUrl = `http://127.0.0.1:3000/${file.path.replace(/\\/g, `/`)}`;
    const adminId = req.user?._id as unknown as Types.ObjectId;
    

    return this.categoryService.create(createCategoryDto, logoUrl, adminId);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor(`file`, multerOptions))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    let logoUrl: string | undefined;
    if (file) {
      logoUrl = `http://127.0.0.1:3000/${file.path.replace(/\\/g, `/`)}`;
    }
    return this.categoryService.update(id, updateCategoryDto, logoUrl);
  }
}
