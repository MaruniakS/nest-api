import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UsersService } from '../users/users.service';
import { ItemsService } from './items.service';

@ApiTags('items')
@Controller('users/:userId')
export class UserItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly usersService: UsersService,
  ) {}
  @Get('items')
  async findUserItems(
    @Param('userId') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    await this.usersService.findById(userId);
    return this.itemsService.findUserItems(userId, paginationQuery);
  }
}
