import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.itemModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const item = await this.itemModel.findOne({ _id: id }).exec();
    if (!item) {
      throw new NotFoundException(`Item #${id} not found`);
    }
    await this.changeCount(item);
    return item;
  }

  create(createItemDto: CreateItemDto) {
    const item = new this.itemModel(createItemDto);
    return item.save();
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const existingItem = await this.itemModel
      .findOneAndUpdate({ _id: id }, { $set: updateItemDto }, { new: true })
      .exec();
    if (!existingItem) {
      throw new NotFoundException(`Item #${id} not found`);
    }
    return existingItem;
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    return item.remove();
  }

  async changeCount(item: Item) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      item.count++;

      const countEvent = new this.eventModel({
        name: 'count item',
        type: 'item',
        payload: { itemId: item.id },
      });

      await countEvent.save({ session });
      await item.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
