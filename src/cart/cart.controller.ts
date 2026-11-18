import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { AuthGuard } from '../common/guards/auth/auth.guard.js';
import type { Request } from 'express';
import { AddToCartDto} from './dto/create-cart.dto.js';
import { Types } from 'mongoose';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(`add`)
  async addToCart(@Req() req: Request, @Body() dto:AddToCartDto) {
    const userId = req.user!._id as unknown as string;
    return this.cartService.addToCart(userId,dto);
  }

  @Get()
  async GetCart(@Req() req: Request) {
    const userId = req.user!._id as unknown as string;
    return this.cartService.getCart(userId);
  }

  @Patch(`item/:productId`)
  async removeItem(@Req() req: Request, @Param(`productId`) productId: string) {
    const userId = req.user!._id as unknown as string;
    return this.cartService.removeItem(userId, productId);
  }


  
}
