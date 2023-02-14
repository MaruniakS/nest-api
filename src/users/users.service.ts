import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  findAll() {
    return this.userModel.find({}, '-password').exec();
  }

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    await this.isUserUnique(user.email);
    return await user.save();
  }

  async findByEmail(email: string) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .exec();
    if (!user) {
      throw new NotFoundException('Wrong email or password');
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }
    return user;
  }

  private async isUserUnique(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('Email must be unique.');
    }
  }
}
