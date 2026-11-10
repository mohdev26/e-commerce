import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './auth/auth.module.js';
import { MailModule } from './mail/mail.module.js';
import { CategoryModule } from './category/category.module.js';
import { BrandModule } from './brand/brand.module.js';
import { ProductModule } from './product/product.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: resolve('./config/.env'),
    isGlobal: true,
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('DB_URI'),
      onConnectionCreate: (connection:Connection) => {
        connection.on(`connected`, () => console.log(`Connected`));
      },
    }),
    inject: [ConfigService],
  }),
  AuthModule,
  MailModule,
  CategoryModule,
  BrandModule,
  ProductModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 