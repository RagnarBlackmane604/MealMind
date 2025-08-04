import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MacrosDto {
  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  fats: number;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  ingredients: string[];

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  steps: string[];

  @IsNumber()
  @IsOptional()
  calories?: number;

  @ValidateNested()
  @Type(() => MacrosDto)
  @IsOptional()
  macros?: MacrosDto;

  @IsString()
  author: string; 

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
