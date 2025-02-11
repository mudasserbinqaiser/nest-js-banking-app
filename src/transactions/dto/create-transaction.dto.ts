import { IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  fromAccountId: number;

  @IsNumber()
  toAccountId: number;

  @IsPositive()
  amount: number;
}
