import { IsEnum, IsOptional, IsNumber, IsEmail } from 'class-validator';

export class GenerateReportDto {
  @IsEnum(['pdf', 'csv'], { message: 'Format must be PDF or CSV' })
  format: 'pdf' | 'csv';

  @IsNumber()
  accountId?: number;

  @IsOptional()
  @IsEmail()
  email?: string;
}
