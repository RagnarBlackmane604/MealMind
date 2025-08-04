import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { Model } from 'mongoose';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    private readonly geminiService: GeminiService,
  ) {}

  async create(recipeData: any): Promise<Recipe> {
    const recipe = new this.recipeModel(recipeData);
    return recipe.save();
  }

  async findAllByAuthor(authorId: string): Promise<Recipe[]> {
    return this.recipeModel.find({ author: authorId });
  }

  async findOne(id: string): Promise<Recipe | null> {
    return this.recipeModel.findById(id);
  }

  async update(id: string, dto: UpdateRecipeDto): Promise<Recipe | null> {
    return this.recipeModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string): Promise<Recipe | null> {
    return this.recipeModel.findByIdAndDelete(id);
  }

  async countByUser(userId: string): Promise<number> {
    return this.recipeModel.countDocuments({ user: userId });
  }

  // --- AI Recipe Generation ---
  // Parameter 'preferences' should be typed with GenerateRecipeDto for better type safety
  async generateAiRecipe(preferences: GenerateRecipeDto): Promise<string> {
    const prompt = this.buildRecipePrompt(preferences);
    return this.geminiService.generateRecipe(prompt);
  }

  // Parameter 'prefs' should also be typed with GenerateRecipeDto
  private buildRecipePrompt(prefs: GenerateRecipeDto): string {
    let prompt = 'Generate a detailed cooking recipe.';
    if (prefs.mealType) prompt += ` For ${prefs.mealType}.`;
    if (prefs.dietaryRestrictions && prefs.dietaryRestrictions.length > 0)
      prompt += ` It should include: ${prefs.dietaryRestrictions.join(', ')}.`;
    if (prefs.allergies && prefs.allergies.length > 0)
      prompt += ` It must NOT contain: ${prefs.allergies.join(', ')}.`;
    if (prefs.servings) prompt += ` For ${prefs.servings} servings.`;
    if (prefs.cuisine) prompt += ` In the style of ${prefs.cuisine} cuisine.`;
    if (prefs.timeLimitMinutes)
      prompt += ` Maximum cooking time: ${prefs.timeLimitMinutes} minutes.`;
    prompt +=
      " Return the recipe as JSON with the following fields: 'title', 'description', 'ingredients' (array of strings), 'instructions' (array of strings, each step as a separate string, do not leave empty), 'prepTime', 'cookTime', 'servings', 'cuisine'.";
    prompt +=
      " The 'instructions' field MUST be a non-empty array of clear, step-by-step cooking instructions.";
    return prompt;
  }
}
