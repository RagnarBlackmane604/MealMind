import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException, // Neu hinzugefügt
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateGoogleUserDto } from '../user/dto/create-google-user.dto';
// import { VerificationToken } from '../models/VerificationToken'; // <-- Direkte Model-Nutzung vermeiden

import { signupSchema } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
// import { v4 as uuidv4 } from 'uuid'; // <-- Nicht mehr nötig, wenn JWT für Token

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { UserDocument } from '../user/schemas/user.schema';
import { VerificationTokenService } from '../verification-token/verification-token.service'; // NEU: Dedizierter Service

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly verificationTokenService: VerificationTokenService, // NEU: Injizieren
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async signup(rawDto: unknown): Promise<{ message: string }> {
    const result = signupSchema.safeParse(rawDto);

    if (!result.success) {
      throw new BadRequestException('Ungültige Eingabedaten');
    }

    const dto = result.data as CreateUserDto;

    console.log('Signup DTO:', dto);

    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      // Optional: Wenn der Benutzer existiert, aber nicht verifiziert ist,
      // kannst du hier die Verifizierungs-E-Mail erneut senden, anstatt einen Konflikt zu werfen.
      if (!existing.isVerified) {
        console.log(
          `User ${dto.email} exists but not verified. Resending verification email.`,
        );
        // Generiere ein neues Token und sende die E-Mail erneut
        const newToken = this.jwtService.sign(
          { email: dto.email, userId: existing._id },
          {
            expiresIn: '24h',
            secret: this.configService.get<string>('JWT_SECRET'),
          },
        );
        await this.verificationTokenService.createToken(
          dto.email,
          newToken,
          new Date(Date.now() + 1000 * 60 * 60 * 24),
        ); // 24h Gültigkeit
        await this.mailService.sendVerificationEmail(dto.email, newToken);
        return {
          message:
            'Benutzer existiert bereits, aber nicht verifiziert. Eine neue Verifizierungs-E-Mail wurde gesendet.',
        };
      }
      throw new ConflictException(
        'Benutzer mit dieser E-Mail-Adresse existiert bereits und ist verifiziert.',
      );
    }

    try {
      // WICHTIG: Stelle sicher, dass createUser das Passwort HASHED!
      const user = await this.userService.createUser({
        ...dto,
        isVerified: false,
      });

      console.log('Created user:', user);
      console.log('JWT_SECRET:', this.configService.get<string>('JWT_SECRET'));
      console.log(
        'JWT_SECRET aus ConfigService:',
        this.configService.get<string>('JWT_SECRET'),
      );
      console.log('JWT_SECRET aus process.env:', process.env.JWT_SECRET);
      // JWT-basiertes Verifizierungs-Token
      const verificationToken = this.jwtService.sign(
        { email: user.email, userId: user._id },
        {
          expiresIn: '24h',
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
      console.log(
        'VerificationToken wird erstellt für:',
        dto.email,
        verificationToken,
      );

      try {
        const result = await this.verificationTokenService.createToken(
          dto.email,
          verificationToken,
          new Date(Date.now() + 1000 * 60 * 60 * 24),
        );
        console.log('VerificationToken gespeichert:', result);
      } catch (err) {
        console.error('Fehler beim Speichern des VerificationToken:', err);
      }

      try {
        await this.mailService.sendVerificationEmail(
          user.email,
          verificationToken,
        );
        console.log(`Verification email sent to ${user.email}`);
        return {
          message: 'Registrierung erfolgreich. Bitte E-Mail bestätigen.',
        };
      } catch (emailError) {
        console.error(
          'Fehler beim Senden der Verifizierungs-E-Mail:',
          emailError,
        );

        throw new InternalServerErrorException(
          'Registrierung erfolgreich, aber Fehler beim Senden der Verifizierungs-E-Mail. Bitte kontaktieren Sie den Support.',
        );
      }
    } catch (dbError) {
      console.error(
        'Fehler bei der Benutzererstellung oder Token-Speicherung:',
        dbError,
      );

      throw new InternalServerErrorException(
        'Fehler bei der Benutzerregistrierung.',
      );
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        throw new BadRequestException('Verifizierungslink ist abgelaufen.');
      }
      throw new BadRequestException('Ungültiger Verifizierungslink.');
    }

    const { email } = payload;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Benutzer nicht gefunden.');
    }

    if (user.isVerified) {
      return { message: 'E-Mail ist bereits verifiziert.' };
    }

    user.isVerified = true;
    await user.save();

    return {
      message: 'E-Mail erfolgreich bestätigt. Du kannst dich jetzt einloggen.',
    };
  }

  async login(dto: LoginDto): Promise<{
    id: string;
    email: string;
    name?: string;
    picture?: string;
    token: string;
  }> {
    const user = await this.userService.findByEmail(dto.email, true);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Ungültige Anmeldedaten');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Ungültige Anmeldedaten');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Bitte bestätige zuerst deine E-Mail-Adresse.',
      );
    }

    const jwtToken = this.jwtService.sign({ sub: user._id, email: user.email });
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      token: jwtToken,
    };
  }

  async validateGoogleToken(token: string): Promise<{
    id: string;
    email: string;
    name?: string;
    picture?: string;
    token: string;
  }> {
    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
    } catch (err) {
      console.error('Google Token Verification Error:', err);
      throw new UnauthorizedException('Ungültiger Google Token');
    }

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new UnauthorizedException('Google-Payload ungültig');
    }

    const { email, given_name, family_name, picture, sub: googleId } = payload;

    let user = await this.userService.findByEmail(email);

    if (!user) {
      const googleUserDto: CreateGoogleUserDto = {
        email,
        name: `${given_name || ''} ${family_name || ''}`.trim(), // Null-Checks für Namen
        picture,
        googleId,
        isVerified: true, // Google-E-Mails sind bereits verifiziert
      };

      user = await this.userService.findOrCreateGoogleUser({
        id: googleId,
        email,
        name: `${given_name || ''} ${family_name || ''}`.trim(),
        picture,
      });
    } else if (user && !user.googleId) {
      // Optional: Wenn der Benutzer bereits mit E-Mail/Passwort existiert,
      // und sich jetzt mit Google anmeldet, verknüpfe das Google-Konto.
      user.googleId = googleId;
      user.isVerified = true; // Setze auf verifiziert, wenn es nicht schon war
      await user.save();
    }

    if (!user) {
      // Falls user.createGoogleUser fehlschlägt
      throw new InternalServerErrorException(
        'Fehler bei der Google-Benutzererstellung.',
      );
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      picture: user.picture,
      ...this.generateToken(user),
    };
  }

  private generateToken(user: UserDocument): { token: string } {
    if (!user) {
      console.error('generateToken: user ist undefined');
      throw new Error('User ist undefined');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      isVerified: user.isVerified,
      // subscription: user.subscription,
    };

    return {
      token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '24h', // Optional: Ablaufzeit für Login-Token
      }),
    };
  }
}
