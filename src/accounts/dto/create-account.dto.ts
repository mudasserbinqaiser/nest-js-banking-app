import { IsEnum, IsNumber } from "class-validator";

export class CreateAccountDto {
    @IsNumber()
    userId: number

    @IsEnum(['savings', 'checking', 'business'])
    type: 'savings' | 'checking' | 'business';
    
}