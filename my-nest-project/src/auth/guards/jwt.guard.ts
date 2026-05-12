import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  // Метод canActivate проверяет, можно ли предоставить доступ к маршруту
  override canActivate(context: ExecutionContext) {
    // Здесь можно добавить кастомную логику перед проверкой (например, логирование)
    return super.canActivate(context);
  }

  // Метод handleRequest обрабатывает результат проверки токена
  override handleRequest(err: any, user: any, info: any) {
    // Если есть ошибка или пользователь не найден (токен невалиден)
    if (err || !user) {
      throw err || new UnauthorizedException('У вас нет доступа (токен невалиден или отсутствует)');
    }
    // Если всё ок, возвращаем пользователя (он запишется в request.user)
    return user;
  }
}