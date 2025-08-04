import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { GeminiModule } from '../gemini/gemini.module';
import { MealPlanModule } from '../mealplan/mealplan.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    GeminiModule,
    CloudinaryModule,
    MealPlanModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
