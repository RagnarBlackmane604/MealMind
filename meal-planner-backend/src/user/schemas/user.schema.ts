import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- User Schema ---
export type SubscriptionType = 'free' | 'premium';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  passwordHash?: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: [String], default: [] })
  allergies: string[];

  @Prop({ type: String, enum: ['free', 'premium'], default: 'free' })
  subscription: SubscriptionType;

  @Prop({ required: false })
  name?: string;

  @Prop({ required: false })
  picture?: string;

  @Prop({ type: String, unique: true, sparse: true })
  googleId?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// --- VerificationToken Schema ---
@Schema({ timestamps: true, expires: 3600 })
export class VerificationToken {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, expires: 0 })
  expires: Date;
}

export type VerificationTokenDocument = VerificationToken & Document;
export const VerificationTokenSchema =
  SchemaFactory.createForClass(VerificationToken);
