import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from '../../users/entities/user.entity';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity = request.user.toObject();
    delete user.password;
    return user;
  },
);
