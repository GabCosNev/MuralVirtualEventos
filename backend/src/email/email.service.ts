// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error('Key não configurada');
    }

    this.resend = new Resend(apiKey);
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error('URL não configurada');
    }

    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Confirme seu e-mail — Mural Virtual de Eventos',
      html: `
        <p>Olá!</p>
        <p>
          Obrigado por se cadastrar no Mural Virtual de Eventos.
          Clique no link abaixo para confirmar seu e-mail:
        </p>
        <p>
          <a href="${verificationUrl}">Confirmar e-mail</a>
        </p>
        <p>Este link expira em 24 horas.</p>
      `,
    });
  }
}
