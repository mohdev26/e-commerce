import { Module } from "@nestjs/common";
import { MailService } from "./mail.service.js";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "node:path";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({ 
        transport: {
          service: `gmail`,
          auth: {
            user: configService.get<string>(`mail_USER`),
            pass: configService.get<string>(`mail_PASS`),
          },
          default: {
            from: `"No Reply" <${configService.get<string>(`mail_USER`)}>`,
          },
          template:{
            dir: join(__dirname, `templates`),
            adepter: new EjsAdapter(),
          }
        },
        inject: [configService],
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailModule],
})
export class MailModule {}
