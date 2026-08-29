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
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="400" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #2027b0;">
              <tr>
                <td style="background-color: #2027b0; padding: 16px 24px;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-family: Arial, sans-serif;">
                    Mural Virtual de Eventos
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px 24px; font-family: Arial, sans-serif; color: #374151;">
                  <p style="margin: 0 0 16px;">Olá!</p>
                  <p style="margin: 0 0 24px;">
                    Obrigado por se cadastrar no Mural Virtual de Eventos.
                    Clique no botão abaixo para confirmar seu e-mail:
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="background-color: #2027b0; border-radius: 8px;">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">
                          Confirmar e-mail
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280;">
                    Este link expira em 24 horas.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    });
  }
}
