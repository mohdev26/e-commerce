import { IsInt, IsMongoId, IsNotEmpty, Min } from "class-validator";

export class AddToCartDto {
    @IsMongoId({message:`Invalid product id`})
    @IsNotEmpty()
    productId: string;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quantity: number;
}
