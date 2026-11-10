import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import { ProductService } from "./product.service.js";
import { CreateProductDto } from "./dto/create-product.dto.js";
import { UpdateProductDto } from "./dto/update-product.dto.js";
import { AuthGuard } from "../common/guards/auth/auth.guard.js";
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../Utils/multer.options.js";
import type { Request } from "express";
import { Types } from "mongoose";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor(`files`, 10, multerOptions))
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files) throw new BadRequestException(`product image must be required`);

    //const imageUrl = `http://127.0.0.1:3000/${files.map((file) => file.path.replace(/\\/g, `/`))}`;

    const imageUrl: string[] = files.map(
      (file) => `http://127.0.0.1:3000/${file.path.replace(/\\/g, "/")}`,
    );
    const adminId = req.user?._id as Types.ObjectId;
    console.log(imageUrl);

    return this.productService.create(createProductDto, imageUrl, adminId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productService.remove(+id);
  }
}
