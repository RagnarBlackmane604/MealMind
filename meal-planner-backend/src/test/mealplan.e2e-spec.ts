import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MealPlanModule } from '../mealplan/mealplan.module';

describe('MealPlanController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MealPlanModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/mealplans (POST) creates a meal plan', () => {
    return request(app.getHttpServer())
      .post('/mealplans')
      .send({ name: 'My Plan', meals: [] })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
