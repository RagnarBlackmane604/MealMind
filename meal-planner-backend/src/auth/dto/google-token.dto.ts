import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class GoogleTokenDto {
  @IsEmail()
  email: string;

  @IsString()
  googleId: string;

  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
