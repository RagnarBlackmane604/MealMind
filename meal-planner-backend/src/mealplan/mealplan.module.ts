import { Module } from '@nestjs/common';
import { MealPlanController } from './mealplan.controller';
import { MealPlanService } from './mealplan.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MealPlan, MealPlanSchema } from './schemas/mealplan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MealPlan.name, schema: MealPlanSchema }]),
  ],
  controllers: [MealPlanController],
  providers: [MealPlanService],
  exports: [MealPlanService],
})
export class MealPlanModule {}
