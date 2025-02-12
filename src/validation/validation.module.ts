import { Module } from '@nestjs/common';
import { SanitizeStringPipe } from './pipes/sanitize-string.pipe';

@Module({
    providers: [SanitizeStringPipe],
    exports: [SanitizeStringPipe],
})
export class ValidationModule {}
