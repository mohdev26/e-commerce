import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailerService.name);
  constructor(private readonly _mailerService: MailerService) {}

  async sendVerficationOtp(email: string, otp: string): Promise<void> {
    try {
      await this._mailerService.sendMail({
        to: email,
        subject: `Your Account Activation Code`,
        template: `.templates/otp`,
        context: { confirmEmailOTP: otp },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to send verification OTP to ${email}: ${error.message}`,
      );
    }
  }
}
