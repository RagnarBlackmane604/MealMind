import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Query,
  UsePipes, // Benötigt, wenn ValidationPipe verwendet wird
  ValidationPipe, // Benötigt, wenn ValidationPipe verwendet wird
  HttpStatus, // Für explizitere Statuscodes
  HttpCode, // Für explizitere Statuscodes
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupSchema } from './dto/signup.dto';
import { GoogleTokenDto } from './dto/google-token.dto';
import { LoginDto } from './dto/login.dto'; // Importiere LoginDto

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED) // Empfohlen für erfolgreiche Erstellung
  async signup(@Body() body: any) {
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      // Detailliertere Fehlermeldungen von Zod
      throw new BadRequestException(
        parsed.error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      );
    }

    return this.authService.signup(parsed.data);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK) // Standard, aber explizit
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // transform: true für DTOs
  async googleLogin(@Body('id_token') idToken: string) {
    return this.authService.validateGoogleToken(idToken);
  }

  @Get('verify-email') // Deine Frontend-Route wird dann auf /auth/verify-email?token= reagieren
  @HttpCode(HttpStatus.OK) // Standard, aber explizit
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verifizierungs-Token ist erforderlich.');
    }
    return this.authService.verifyEmail(token);
  }
}
