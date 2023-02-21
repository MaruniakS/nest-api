import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    return await this.authService.login(req, loginDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@User() user: UserEntity) {
    return user;
  }
}
