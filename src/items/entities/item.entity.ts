import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type ItemDocument = Item & Document;

@Schema()
export class Item extends Document {
  @Prop()
  name: string;

  @Prop({ default: false })
  checked: boolean;

  @Prop({ default: 0 })
  count: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: User;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
