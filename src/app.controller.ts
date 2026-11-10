import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller("products")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("create")
  @HttpCode(201)
  createProduct(): string {
    return "Product created";
  }
}
