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
      // <-- 'try' block starts here
      await this.mailerService.sendMail({
        to: email,
        subject: 'Willkommen bei MealMind! 🎉',
        text: 'Danke für deine Registrierung bei MealMind!',
        html: `<h1>Hallo!</h1><p>Danke für deine Registrierung bei <strong>MealMind</strong>! 🎉</p>`,
      });
      console.log(`Willkommens-E-Mail erfolgreich an ${email} gesendet.`);
    } catch (error) {
      // <-- 'catch' block starts here
      console.error(
        `Fehler beim Senden der Willkommens-E-Mail an ${email}:`,
        error,
      );
      // Optional: You might want to re-throw the error or handle it more gracefully
      // throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }

  async sendPasswordReset(email: string, token: string) {
    const resetLink = `${this.getBaseUrl()}/reset-password?token=${token}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '🔐 Passwort zurücksetzen',
        text: `Passwort zurücksetzen: ${resetLink}`,
        html: `<p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });
      console.log(`Passwort-Reset-E-Mail erfolgreich an ${email} gesendet.`);
    } catch (error) {
      console.error(
        `Fehler beim Senden der Passwort-Reset-E-Mail an ${email}:`,
        error,
      );
      // throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  async sendTestEmail(to: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: '✅ Test-Mail von MealMind (NestJS)',
        text: 'Hallo, das ist eine Test-Mail von deinem NestJS Backend!',
        html: '<p><strong>Hallo</strong>, das ist eine Test-Mail von deinem NestJS Backend! 🎯</p>',
      });
      console.log(`Test-E-Mail erfolgreich an ${to} gesendet.`);
    } catch (error) {
      console.error(`Fehler beim Senden der Test-E-Mail an ${to}:`, error);
      // throw new Error(`Failed to send test email: ${error.message}`);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const verifyLink = `${this.getBaseUrl()}/verify-email?token=${token}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '📩 Bitte bestätige deine E-Mail-Adresse',
        text: `Bestätige deine E-Mail-Adresse hier: ${verifyLink}`,
        html: `
          <p>Willkommen bei <strong>MealMind</strong>!</p>
          <p>Bitte bestätige deine E-Mail-Adresse, indem du auf den folgenden Link klickst:</p>
          <p><a href="${verifyLink}">${verifyLink}</a></p>
        `,
      });
      console.log(`Verifizierungs-E-Mail erfolgreich an ${email} gesendet.`);
    } catch (error) {
      console.error(
        `Fehler beim Senden der Verifizierungs-E-Mail an ${email}:`,
        error,
      );
      // throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }
}
