import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, expires: 3600 })
export class VerificationToken extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expires: Date;
}

export const VerificationTokenSchema =
  SchemaFactory.createForClass(VerificationToken);
