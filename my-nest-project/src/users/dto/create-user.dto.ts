// create-user.dto.ts
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @MinLength(3, { message: 'Имя должно быть не короче 3 символов' })
  userName!: string;

  @IsEmail({}, { message: 'Некорректный формат email' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Роль должна быть либо admin, либо user' })
  role?: UserRole;
}