import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/JwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return {
      ...this.prepareUserInfo(user),
      accessToken: await this.createAccessToken(user),
    };
  }

  async login(req: Request, loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    await this.verifyPassword(loginDto.password, user);
    return {
      ...this.prepareUserInfo(user),
      accessToken: await this.createAccessToken(user),
    };
  }

  private async createAccessToken(user: User) {
    const payload: JwtPayload = { userId: user._id };
    return this.jwtService.sign(payload);
  }

  private async verifyPassword(pass: string, user: User) {
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      throw new NotFoundException('Wrong email or password.');
    }
    return isPasswordMatching;
  }

  private prepareUserInfo(user: User) {
    const userInfo = user.toObject();
    delete userInfo.password;
    return userInfo;
  }
}
