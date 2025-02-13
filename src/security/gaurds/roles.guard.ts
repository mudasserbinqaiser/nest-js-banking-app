import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { User } from 'src/users/user.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Get required roles from the method-level decorator
    let requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    // If method has no specific role, check for class-level decorator
    if (!requiredRoles) {
      requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getClass());
    }

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User not found');
    }

    if (!user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return true;
  }
}
