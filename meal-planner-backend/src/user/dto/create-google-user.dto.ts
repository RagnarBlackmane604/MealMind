import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateGoogleUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  googleId: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
