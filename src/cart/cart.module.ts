import { Module } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { UserModel } from '../DB/models/user.model.js';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel, CartModule],
  controllers: [CartController],
  providers: [CartService, JwtService],
})
export class CartModule {}
