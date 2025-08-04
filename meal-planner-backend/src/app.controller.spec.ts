import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getStatus', () => {
    it('should return a status object', () => {
      const result = appController.getStatus();
      expect(result).toHaveProperty('status', 'OK');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('message', 'Meal Planner API is running');
    });
  });
});

