import { IsString, IsArray, IsOptional, IsNumber, Min } from 'class-validator';

export class GenerateRecipeDto {
  @IsString()
  @IsOptional()
  mealType?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryRestrictions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @IsNumber()
  @Min(1)
  @IsOptional()
  servings?: number;

  @IsString()
  @IsOptional()
  cuisine?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  timeLimitMinutes?: number;

  prompt: string;
  mealPlanId?: string;
}
