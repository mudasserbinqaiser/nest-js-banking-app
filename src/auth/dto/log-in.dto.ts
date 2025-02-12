import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { SanitizeStringPipe } from 'src/validation/pipes/sanitize-string.pipe';

export class LoginInDto {
  @IsEmail()
  @Transform(({ value }) => new SanitizeStringPipe().transform(value)) // ✅ Remove unwanted characters
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
