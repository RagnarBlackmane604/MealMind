import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('recipe')
  async generateRecipe(@Body('prompt') prompt: string) {
    return await this.geminiService.generateRecipe(prompt);
  }
}
