
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GenderEnum, RoleEnum } from "../../common/enums/user.enum.js";
import { HydratedDocument } from "mongoose";
import { hash } from "bcrypt";

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
  })
  firstname: string;

  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
  })
  lastname: string;

  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: Date,
  })
  confirmEmail: Date;

  @Prop({
    type: String,
    default: undefined,
  })
  confirmEmailOTP: string | undefined;

  @Prop({
    type: Date,
    default: undefined,
  })
  otpExpiresAt: Date | undefined;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(GenderEnum),
      message: `{VALUE} is not a valid gender`,
    },
    default: GenderEnum.MALE,
  })
  gender: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(RoleEnum),
      message: `{VALUE} is not a valid role`,
    },
    default: RoleEnum.USER,
  })
  role: string;

  @Prop({ type: String })
  profilePic: string;

  @Prop([{ type: String }])
  coverPic: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 12);
  }
});

UserSchema.virtual("username")
  .get(function (this: any) {
    return this.firstname + " " + this.lastname;
  })
  .set(function (this: any, value: string) {
    const [firstname, lastname] = value.split(" ");
    this.firstname = firstname;
    this.lastname = lastname;
  });

export type HUserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  {name: User.name, schema: UserSchema},
]);
