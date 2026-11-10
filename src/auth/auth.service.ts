import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto.js";
import { InjectModel } from "@nestjs/mongoose";
import { HUserDocument, User } from "../DB/models/user.model.js";
import { Model } from "mongoose";
import { compare, hash } from "../common/security/hash.js";
import { MailService } from "../mail/mail.service.js";
import { VerifyEmailDto } from "./dto/verify-email.dto.js";
import { ResendOtpDto } from "./dto/resend-otp-email.dto.js";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<HUserDocument>,
    private readonly _mailService: MailService,
  ) {}
  async register(createAuthDto: CreateAuthDto): Promise<HUserDocument> {
    const existingUser = await this._userModel.findOne({
      email: createAuthDto.email,
    });
    if (existingUser)
      throw new ConflictException(
        `An account with this email adress already exists`,
      );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOTP = await hash(otp);

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);

    const hashedPassword = await hash(createAuthDto.password);

    const newUser = new this._userModel({
      ...createAuthDto,
      password: hashedPassword,
      confirmEmailOTP: hashedOTP,
      otpExpiresAt: expiryTime,
    });

    const savedUser = await newUser.save();

    this._mailService.sendVerficationOtp(savedUser.email, otp);
    return savedUser;
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    const user = await this._userModel.findOne({ email: verifyEmailDto.email });
    if (!user)
      throw new NotFoundException(
        `Not Account recored match this email address`,
      );
    if (user.confirmEmail)
      throw new BadGatewayException(
        `this email account has already been confirmed`,
      );
    if (
      !user.confirmEmailOTP ||
      !(await compare(verifyEmailDto.confirmEmailOTP, user.confirmEmailOTP))
    )
      throw new BadRequestException(`this code provided in incorrect`);

    if (new Date() > user.otpExpiresAt!)
      throw new BadRequestException(
        `this verfication code has expired, please sign up again`,
      );

    user.confirmEmail = new Date();
    user.confirmEmailOTP = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return { message: `Your email address has been successfully verfied` };
  }
  async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ message: string }> {
    const { email } = resendOtpDto;

    const user = await this._userModel.findOne({ email });
    if (!user)
      throw new NotFoundException(`Not Account recored match email address`);

    if (user.confirmEmail)
      throw new BadRequestException(
        `this email account has already been confirmed`,
      );

      const otp = Math.floor(100000 + Math.random() * 90000).toString();

      const hashedOTP = await hash(otp);
      const newExpiryTime = new Date();
      newExpiryTime.setMinutes(newExpiryTime.getMinutes() + 5);

      user.confirmEmailOTP = hashedOTP;
      user.otpExpiresAt = newExpiryTime;
      await user.save();

      await this._mailService.sendVerficationOtp(user.email, otp);

      return {message: " A fresh verfication code has been successfully"}

  }
}
