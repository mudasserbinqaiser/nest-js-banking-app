import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class SanitizeStringPipe implements PipeTransform {
  transform(value: string) {
    return value.trim().replace(/<[^>]*>?/gm, ''); // Remove HTML tags
  }
}
