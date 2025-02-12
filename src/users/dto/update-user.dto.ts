import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { SanitizeStringPipe } from 'src/validation/pipes/sanitize-string.pipe';

export class UpdateUserDto {
  @IsNotEmpty()
  @Transform(({ value }) => new SanitizeStringPipe().transform(value))
  name: string;
}
