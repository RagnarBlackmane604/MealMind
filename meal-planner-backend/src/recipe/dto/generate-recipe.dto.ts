import { IsString, IsArray, IsOptional, IsNumber, Min } from 'class-validator';

export class GenerateRecipeDto {
  @IsString()
  @IsOptional()
  mealType?: string; // e.g., 'breakfast', 'lunch', 'dinner'

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryRestrictions?: string[]; // e.g., ['vegetarian', 'gluten-free']

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[]; // e.g., ['peanuts', 'dairy']

  @IsNumber()
  @Min(1)
  @IsOptional()
  servings?: number;

  @IsString()
  @IsOptional()
  cuisine?: string; // e.g., 'Italian', 'Mexican'

  @IsNumber()
  @Min(1)
  @IsOptional()
  timeLimitMinutes?: number; // Max preparation/cooking time

  // Add any other preferences you want to send to Gemini
}
