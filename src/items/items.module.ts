import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../events/entities/event.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item, ItemSchema } from './entities/item.entity';
import { UserItemsController } from './user-items.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Item.name,
        schema: ItemSchema,
      },
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [ItemsController, UserItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
