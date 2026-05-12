import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Получаем роли, которые мы прописали в декораторе @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если у метода нет декоратора @Roles, значит доступ разрешен всем авторизованным
    if (!requiredRoles) {
      return true;
    }

    // 2. Получаем пользователя из запроса (его туда положил JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 3. Проверяем, есть ли у пользователя нужная роль
    const hasRole = requiredRoles.some((role) => user.role?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('У вас недостаточно прав для этого действия');
    }

    return hasRole;
  }
}