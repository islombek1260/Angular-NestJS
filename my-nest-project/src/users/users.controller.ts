import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { existsSync } from 'fs';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Здесь можно добавить guards для проверки прав доступа
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не получен. Проверьте ключ "file" в Postman');
    }

    // Формируем путь, который будет храниться в базе
    // Используем прямой слэш для URL, даже если сервер на Windows
    const filePath = `uploads/avatars/${file.filename}`;

    console.log(`Обновление avatarpath для пользователя ${id}:`, filePath);

    // Передаем путь в сервис
    return this.usersService.updateAvatar(id, filePath);
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(id);

    // Путь к стандартной аватарке (положите её в папку uploads или assets бэкенда)
    const defaultAvatar = join(process.cwd(), 'uploads', 'default-avatar.png');

    // 1. Проверяем пользователя и наличие записи о пути
    if (!user || !user.avatarPath) {
      return res.sendFile(defaultAvatar);
    }

    const filePath = join(process.cwd(), user.avatarPath);

    // 2. Проверяем физическое наличие файла
    if (!existsSync(filePath)) {
      return res.sendFile(defaultAvatar);
    }

    // 3. Если всё ок — отправляем оригинал
    return res.sendFile(filePath);
  }
}