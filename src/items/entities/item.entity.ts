import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item extends Document {
  @Prop()
  name: string;

  @Prop({ default: false })
  checked: boolean;

  @Prop({ default: 0 })
  count: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
