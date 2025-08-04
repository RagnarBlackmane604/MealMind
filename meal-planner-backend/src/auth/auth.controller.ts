import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupSchema } from './dto/signup.dto';
import { GoogleTokenDto } from './dto/google-token.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: any) {
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
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
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async googleLogin(@Body('id_token') idToken: string) {
    return this.authService.validateGoogleToken(idToken);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verifizierungs-Token ist erforderlich.');
    }
    return this.authService.verifyEmail(token);
  }
}
