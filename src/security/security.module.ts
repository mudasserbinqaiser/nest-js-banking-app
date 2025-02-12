import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from './gaurds/roles.guard';

@Module({
  providers: [SecurityService, JwtAuthGuard, RolesGuard],
  exports: [SecurityService, JwtAuthGuard, RolesGuard],
})
export class SecurityModule {}
