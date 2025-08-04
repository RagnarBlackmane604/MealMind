import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MealPlan } from './schemas/mealplan.schema';
import { Model } from 'mongoose';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';

@Injectable()
export class MealPlanService {
  constructor(
    @InjectModel(MealPlan.name) private mealPlanModel: Model<MealPlan>,
  ) {}

  async create(userId: string, dto: CreateMealPlanDto) {
    const mealPlan = new this.mealPlanModel({
      ...dto,
      user: userId,
      image: dto.image,
    });
    return mealPlan.save();
  }

  async findAllByUser(userId: string) {
    return this.mealPlanModel.find({ user: userId });
  }

  async findOne(id: string) {
    return this.mealPlanModel.findById(id);
  }

  async update(id: string, dto: UpdateMealPlanDto) {
    return this.mealPlanModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.mealPlanModel.findByIdAndDelete(id);
  }

  async countByUser(userId: string): Promise<number> {
    return this.mealPlanModel.countDocuments({ user: userId });
  }
}
