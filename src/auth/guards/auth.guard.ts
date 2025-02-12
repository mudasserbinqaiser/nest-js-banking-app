import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/security/decorators/roles.decorators';
import { User } from 'src/users/user.model';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context); // Apply default JWT authentication
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // Check if the route requires specific roles
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    // Enforce 2FA if required
    if (user.requiresTwoFactorAuth && !user.isTwoFactorAuthenticated) {
      throw new ForbiddenException('Two-Factor Authentication required');
    }

    return true;
  }
}
