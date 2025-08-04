import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtAuthMiddleware } from './middleware/jwt-auth.middleware';
import { SubscriptionLimitMiddleware } from './middleware/subscription-limit.middleware';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { MealPlanModule } from './mealplan/mealplan.module';
import { RecipeModule } from './recipe/recipe.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri:
          config.get<string>('DATABASE_URL') ||
          'mongodb://localhost:27017/mealplanner',
      }),
    }),
    UserModule,
    MealPlanModule,
    RecipeModule,
    MailModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware, SubscriptionLimitMiddleware)
      .forRoutes(
        { path: 'recipes', method: RequestMethod.POST },
        { path: 'meal-plans', method: RequestMethod.POST },
      );
  }
}
