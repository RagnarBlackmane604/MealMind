import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private getBaseUrl(): string {
    return (
      this.configService.get('FRONTEND_BASE_URL') || 'http://localhost:3000'
    );
  }

  async sendWelcomeEmail(email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to MealMind! 🎉',
        text: 'Thank you for registering with MealMind!',
        html: `<h1>Hello!</h1><p>Thank you for registering with <strong>MealMind</strong>! 🎉</p>`,
      });
      console.log(`Welcome email successfully sent to ${email}.`);
    } catch (error) {
      console.error(`Error sending welcome email to ${email}:`, error);
    }
  }

  async sendPasswordReset(email: string, token: string) {
    const resetLink = `${this.getBaseUrl()}/reset-password?token=${token}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '🔐 Reset your password',
        text: `Reset your password: ${resetLink}`,
        html: `<p>Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });
      console.log(`Password reset email successfully sent to ${email}.`);
    } catch (error) {
      console.error(`Error sending password reset email to ${email}:`, error);
      // throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  async sendTestEmail(to: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: '✅ Test email from MealMind (NestJS)',
        text: 'Hello, this is a test email from your NestJS backend!',
        html: '<p><strong>Hello</strong>, this is a test email from your NestJS backend! 🎯</p>',
      });
      console.log(`Test email successfully sent to ${to}.`);
    } catch (error) {
      console.error(`Error sending test email to ${to}:`, error);
      // throw new Error(`Failed to send test email: ${error.message}`);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const verifyLink = `${this.getBaseUrl()}/verify-email?token=${token}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '📩 Please verify your email address',
        text: `Verify your email address here: ${verifyLink}`,
        html: `
          <p>Welcome to <strong>MealMind</strong>!</p>
          <p>Please verify your email address by clicking the following link:</p>
          <p><a href="${verifyLink}">${verifyLink}</a></p>
        `,
      });
      console.log(`Verification email successfully sent to ${email}.`);
    } catch (error) {
      console.error(`Error sending verification email to ${email}:`, error);
      // throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }
}
