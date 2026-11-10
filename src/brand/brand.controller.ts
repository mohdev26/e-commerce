import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  BadGatewayException,
  Req,
} from "@nestjs/common";
import { BrandService } from "./brand.service.js";
import { CreateBrandDto } from "./dto/create-brand.dto.js";
import { UpdateBrandDto } from "./dto/update-brand.dto.js";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../Utils/multer.options.js";
import { Types } from "mongoose";
import type { Request } from "express";

@Controller("brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor(`file`, multerOptions))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: CreateBrandDto,
    @Req() req: Request,
  ) {
    if (!file) throw new BadGatewayException(`category logo is required`);

    const logoUrl = `http://127.0.0.1:3000/${file.path.replace(/\\/g, `/`)}`;
    const adminId = req.user?._id as unknown as Types.ObjectId;

    return this.brandService.create(
      createCategoryDto,
      logoUrl,
      adminId.toString(),
    );
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: Types.ObjectId) {
    return this.brandService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor(`file`, multerOptions))
  update(
    @Param("id") id: Types.ObjectId,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let logoUrl: string | undefined;

    if (file)
      logoUrl = `http://127.0.0.1:3000/${file.path.replace(/\\/g, `/`)}`;

    return this.brandService.update(id, updateBrandDto, logoUrl);
  }
}
