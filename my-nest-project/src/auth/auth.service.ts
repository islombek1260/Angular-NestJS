import { Injectable, Inject, forwardRef, UnauthorizedException, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class AuthService {
  create(createUserDto: RegisterDto) {
    throw new Error("Method not implemented.");
  }
  userRepository: any;
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const candidate = await this.usersService.findByEmail(registerDto.email);
    if (candidate) throw new HttpException('User exists', 400);

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword
    });

    const payload = { sub: user.id, email: user.email, role: user.role, avatarPath: user.avatarPath, userName: user.userName };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginUserDto) {
    if (!loginDto.password) {
      throw new UnauthorizedException('Пароль не указан');
    }

    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    try {
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Неверный email или пароль');
      }
    } catch (err) {
      throw new UnauthorizedException('Ошибка проверки пароля. Возможно, аккаунт устарел.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, avatarPath: user.avatarPath, userName: user.userName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}