import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class VerifyEmailDto {
  @IsEmail({}, { message: "please provide a valid email format" })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty({ message: `OTP verfication code is required` })
  confirmEmailOTP: string;
}
