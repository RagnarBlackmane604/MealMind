import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { storage } from '../cloudinary/cloudinary.storage';
import { ImageUploadService } from '../cloudinary/image-upload.service';
import { GeminiService } from '../gemini/gemini.service';
import { MealPlanService } from '../mealplan/mealplan.service';

@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly imageUploadService: ImageUploadService,
    private readonly geminiService: GeminiService,
    private readonly mealPlanService: MealPlanService,
  ) {}

  // ---

  //## Recipe Management Endpoints (CRUD)

  // ### Create Recipe
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createRecipeDto: CreateRecipeDto, @Req() req: any) {
    createRecipeDto.author = req.user.userId;
    return this.recipeService.create(createRecipeDto);
  }

  // ### Get All Recipes by Author
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: any) {
    const recipes = await this.recipeService.findAllByAuthor(req.user.userId);

    return recipes.map((recipe: any) => ({
      ...(typeof recipe.toObject === 'function' ? recipe.toObject() : recipe),
      instructions: recipe.steps,
    }));
  }

  // ### Get Single Recipe
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const recipe: any = await this.recipeService.findOne(id);
    return {
      ...(typeof recipe.toObject === 'function' ? recipe.toObject() : recipe),
      instructions: recipe.steps,
    };
  }

  // ### Update Recipe
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    // const recipe = await this.recipeService.findOne(id);
    // if (!recipe || recipe.author.toString() !== req.user.userId) {
    //   throw new ForbiddenException('You are not authorized to update this recipe.');
    // }
    return this.recipeService.update(id, updateRecipeDto);
  }

  // ### Delete Recipe
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    // const recipe = await this.recipeService.findOne(id);
    // if (!recipe || recipe.author.toString() !== req.user.userId) {
    //   throw new ForbiddenException('You are not authorized to delete this recipe.');
    // }
    return this.recipeService.remove(id);
  }

  // ---

  // ## AI Recipe Generation

  // ### Generate Recipe with AI
  @Post('generate-ai')
  @HttpCode(HttpStatus.OK)
  async generateAiRecipe(@Body() body: { prompt: string }, @Req() req: any) {
    // KI-Rezept generieren
    let aiRecipe = await this.geminiService.generateRecipe(body.prompt);
    console.log('AI-RESPONSE:', aiRecipe);

    if (typeof aiRecipe === 'string' && aiRecipe.trim().startsWith('```json')) {
      aiRecipe = aiRecipe
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/```$/, '')
        .trim();
      try {
        aiRecipe = JSON.parse(aiRecipe);
      } catch (e) {
        throw new BadRequestException('AI response is not valid JSON');
      }
    }

    // Author hinzufügen
    aiRecipe.author = req.user?.userId;

    if (
      !Array.isArray(aiRecipe.instructions) ||
      aiRecipe.instructions.length === 0
    ) {
      aiRecipe.instructions = ['No instructions provided by AI.'];
    }
    if (!Array.isArray(aiRecipe.steps) && aiRecipe.instructions) {
      aiRecipe.steps = aiRecipe.instructions;
    }
    const savedRecipe = await this.recipeService.create(aiRecipe);
    return savedRecipe;
  }

  // ### Generate Recipe (Alternative AI Endpoint)
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generateRecipe(
    @Body() body: { mealPlanId?: string; prompt: string },
    @Req() req: any,
  ) {
    let prompt = body.prompt;

    if (body.mealPlanId) {
      const mealPlan = await this.mealPlanService.findOne(body.mealPlanId);
      if (!mealPlan) {
        throw new BadRequestException('MealPlan not found');
      }

      prompt = `
        Create a creative recipe for the following meal plan:
        Title: ${mealPlan.title}
        Goal: ${mealPlan.goal}
        Period: ${mealPlan.startDate} to ${mealPlan.endDate}
        Diet: ${(mealPlan.diet || []).join(', ')}
        Allergies: ${mealPlan.allergies || 'None'}
        Notes: ${mealPlan.notes || 'None'}
        Existing recipes: ${(mealPlan.recipes || []).length}
        Please return the recipe as JSON with fields: title, ingredients (array), instructions (array).
      `;
    }

    let aiRecipe = await this.geminiService.generateRecipe(prompt);

    if (typeof aiRecipe === 'string' && aiRecipe.trim().startsWith('```json')) {
      aiRecipe = aiRecipe
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/```$/, '')
        .trim();
      try {
        aiRecipe = JSON.parse(aiRecipe);
      } catch (e) {
        throw new BadRequestException('AI response is not valid JSON');
      }
    }

    aiRecipe.author = req.user?.userId;
    if (body.mealPlanId) {
      aiRecipe.mealPlan = body.mealPlanId;
    }

    if (
      !Array.isArray(aiRecipe.instructions) ||
      aiRecipe.instructions.length === 0
    ) {
      aiRecipe.instructions = ['No instructions provided by AI.'];
    }
    if (!Array.isArray(aiRecipe.steps) && aiRecipe.instructions) {
      aiRecipe.steps = aiRecipe.instructions;
    }

    const savedRecipe = await this.recipeService.create(aiRecipe);
    return savedRecipe;
  }

  // ## Image Upload

  // ### Upload Recipe Image
  @Post('upload-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', { storage }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided.');
    }
    const result = await this.imageUploadService.uploadImageToCloudinary(file);
    return { imageUrl: result.secure_url };
  }
}
