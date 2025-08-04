import { Injectable } from '@nestjs/common';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

@Injectable()
export class GeminiService {
  async generateRecipe(prompt: string): Promise<any> {
    try {
      const model = google('gemini-2.5-flash');
      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt,
        providerOptions: {
          google: {
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
            ],
            responseModalities: ['TEXT'],
          },
        },
      });

      if (!text) {
        throw new Error('AI response missing');
      }

      let recipe: any = null;
      try {
        recipe = JSON.parse(text);
      } catch (e) {
        recipe = text;
      }
      return recipe;
    } catch (error) {
      console.error('Error generating recipe with Gemini:', error);
      throw new Error('Could not generate recipe with AI.');
    }
  }
}
