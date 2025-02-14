import { Transform } from "class-transformer";
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches, 
  IsOptional
} from "class-validator";
import { SanitizeStringPipe } from "src/validation/pipes/sanitize-string.pipe";

export class SendEmailDto {
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Recipient email is required" })
    @Transform(({ value }) => new SanitizeStringPipe().transform(value))
    to: string;

    @IsString({ message: "Subject must be a string" })
    @IsNotEmpty({ message: "Subject cannot be empty" })
    @MinLength(3, { message: "Subject must be at least 3 characters" })
    @MaxLength(100, { message: "Subject cannot exceed 100 characters" })
    @Transform(({ value }) => new SanitizeStringPipe().transform(value))
    subject: string;

    @IsString({ message: "Body must be a string" })
    @IsNotEmpty({ message: "Body cannot be empty" })
    @MinLength(5, { message: "Body must be at least 10 characters" })
    @MaxLength(5000, { message: "Body cannot exceed 5000 characters" })
    @Transform(({ value }) => new SanitizeStringPipe().transform(value))
    body: string;

    @IsOptional()
    @IsString({ message: "Attachment path must be a string" })
    @Transform(({ value }) => new SanitizeStringPipe().transform(value))
    attachment?: string;
}
