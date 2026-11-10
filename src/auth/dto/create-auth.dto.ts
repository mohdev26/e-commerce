import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Transform } from "class-transformer";
import { GenderEnum, RoleEnum } from "../../common/enums/user.enum.js";
export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 20, {
    message: `First name must be between 2 and 20 cahracter long`,
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 20, {
    message: `Last name must be between 2 and 20 cahracter long`,
  })
  lastName: string;

  @IsEmail({}, { message: "please provide a valid email format" })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty({ message: `Password is required` })
  password: string;

  @IsEnum(GenderEnum, {
    message: `provided value is not gender value`,
  })
  @IsOptional()
  gender?: GenderEnum;

  @IsEnum(RoleEnum, {
    message: `provided value is not gender value`,
  })
  @IsOptional()
  role?: RoleEnum;
}
