import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { SanitizeStringPipe } from 'src/validation/pipes/sanitize-string.pipe';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => new SanitizeStringPipe().transform(value))
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => new SanitizeStringPipe().transform(value))
  name: string;

  @IsEnum(['customer', 'admin', 'banker'])
  role: 'customer' | 'admin' | 'banker';
}
