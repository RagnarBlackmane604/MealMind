import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Macros, MacrosSchema } from './macros.schema';

export type RecipeDocument = Recipe & Document;

@Schema({ timestamps: true })
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop({ type: [String], required: true })
  steps: string[];

  @Prop()
  calories?: number;

  @Prop({ type: MacrosSchema })
  macros?: Macros;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MealPlan' })
  mealPlan?: Types.ObjectId;

  @Prop()
  imageUrl?: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
