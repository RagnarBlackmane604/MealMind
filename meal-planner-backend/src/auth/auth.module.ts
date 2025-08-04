import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VerificationTokenModule } from '../verification-token/verification-token.module';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    UserModule,
    MailModule,
    ConfigModule,
    VerificationTokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
