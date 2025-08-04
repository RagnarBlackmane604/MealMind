import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'Meal Planner API is running',
    };
  }
}
