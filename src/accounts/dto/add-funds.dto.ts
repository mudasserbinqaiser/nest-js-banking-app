import { IsNumber, IsPositive } from "class-validator";

export class AddFundsDto {
    @IsNumber()
    userId: number

    @IsNumber()
    @IsPositive()
    amount: number;
}