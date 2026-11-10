import { Controller, Post, Body, Patch } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { CreateAuthDto } from "./dto/create-auth.dto.js";
import { VerifyEmailDto } from "./dto/verify-email.dto.js";
import { ResendOtpDto } from "./dto/resend-otp-email.dto.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`signup`)
  async register(@Body() CreateAuthDto: CreateAuthDto) {
    const user = await this.authService.register(CreateAuthDto);
    return {
      success: true,
      message: "Done",
      results: user,
    };
  }

  @Patch(`verify-email`)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  @Patch(`resend-email`)
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return await this.authService.resendOtp(resendOtpDto);
  }
}
