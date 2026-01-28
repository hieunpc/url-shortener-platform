import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Url extends Document {
  @Prop({ required: true, unique: true, index: true })
  shortCode: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ default: 0 })
  clickCount: number;

  @Prop({ type: [{ date: String, count: Number }], default: [] })
  clickHistory: { date: string; count: number }[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
