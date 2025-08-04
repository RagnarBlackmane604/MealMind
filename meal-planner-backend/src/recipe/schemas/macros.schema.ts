import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Macros {
  @Prop()
  protein: number;

  @Prop()
  carbs: number;

  @Prop()
  fat: number;
}

export const MacrosSchema = SchemaFactory.createForClass(Macros);

