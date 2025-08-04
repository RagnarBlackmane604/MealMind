import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MealPlan extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  goal: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ type: [String], default: [] })
  recipes: string[];

  @Prop({ type: [String], default: [] })
  diet: string[];

  @Prop()
  allergies?: string;

  @Prop()
  notes?: string;

  @Prop()
  image?: string;

  @Prop({ required: true })
  user: string;
}

export const MealPlanSchema = SchemaFactory.createForClass(MealPlan);
