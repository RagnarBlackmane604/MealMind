import { IsOptional, IsString, IsDateString, IsArray } from 'class-validator';

export class UpdateMealPlanDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  recipes?: string[];

  @IsOptional()
  @IsArray()
  diet?: string[];

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
