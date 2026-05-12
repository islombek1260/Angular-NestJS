import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities//user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../items/products.module';

@Module({
  imports: [
    AuthModule, // Импортируем AuthModule для использования AuthService внутри UsersService
    ProductModule, // Импортируем ProductModule для использования ProductService внутри UsersService
    TypeOrmModule.forFeature([User]), // Импортируем репозиторий User для работы с базой данных
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Экспортируем сервис, чтобы его можно было использовать в других модулях
})
export class UsersModule {}