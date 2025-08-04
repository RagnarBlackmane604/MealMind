import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { RecipeService } from '../recipe/recipe.service';
import { MealPlanService } from '../mealplan/mealplan.service';

interface RequestWithUser extends Request {
  user?: { userId: string; email?: string };
}

@Injectable()
export class SubscriptionLimitMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly recipeService: RecipeService,
    private readonly mealPlanService: MealPlanService,
  ) {}

async use(req: RequestWithUser, res: Response, next: NextFunction) {
  const userId = req.user?.userId;
  const routePath = req.originalUrl; 

  if (!userId) return next();

  const user = await this.userService.findById(userId);
  if (!user) return next();

  if (user.subscription === 'premium') return next();

  if (req.method === 'POST' && routePath.includes('/recipes')) {
    const recipeCount = await this.recipeService.countByUser(userId);
    if (recipeCount >= 2) {
      throw new ForbiddenException(
        'Free plan allows only 2 recipes. Upgrade to premium.',
      );
    }
  }

  if (req.method === 'POST' && routePath.includes('/meal-plans')) {
    const mealPlanCount = await this.mealPlanService.countByUser(userId);
    if (mealPlanCount >= 1) {
      throw new ForbiddenException(
        'Free plan allows only 1 meal plan. Upgrade to premium.',
      );
    }
  }

  next();
}
}