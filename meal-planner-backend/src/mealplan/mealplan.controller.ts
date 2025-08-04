import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MealPlanService } from './mealplan.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('meal-plans')
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() dto: CreateMealPlanDto, @Req() req: any) {
    console.log('Authorization Header:', req.headers.authorization);
    const result = await this.mealPlanService.create(req.user.userId, dto);
    console.log('MealPlan gespeichert:', result);
    return result;
  }

  @Get()
  findAll(@Req() req: any) {
    return this.mealPlanService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealPlanService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Param('id') id: string, @Body() dto: UpdateMealPlanDto) {
    return this.mealPlanService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.mealPlanService.remove(id);
  }
}
