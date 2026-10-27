import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { Suggestion, SuggestionDocument } from './entities/suggestion.schema';
import { User, UserDocument } from '../users/entities/schema';

export interface CreateSuggestionDto {
  user_id: number;
  user_name: string;
  user_email: string;
  category: string;
  subject: string;
  message: string;
}

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(Suggestion.name)
    private readonly suggestionModel: Model<SuggestionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: CreateSuggestionDto) {
    const suggestionId = `sug-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const created = await this.suggestionModel.create({
      id: suggestionId,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      category: data.category || 'Sugerencia general',
      subject: data.subject || 'Sin asunto',
      message: data.message,
      status: 'pending',
      created_at: new Date(),
    });

    // Enviar notificación por correo a las cuentas registradas como docentes
    try {
      const teachers = await this.userModel
        .find({ role: 'teacher', status: 'active', emailVerified: true })
        .select('email name')
        .lean()
        .exec();

      const teacherEmails = teachers.map((t) => t.email).filter(Boolean);
      // Incluir también el correo oficial de atención institucional liderabot.app@gmail.com
      const allRecipients = Array.from(new Set([...teacherEmails, 'liderabot.app@gmail.com']));

      const smtpPort = Number(process.env.SMTP_PORT ?? 587);
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@liderabot.local';

      if (smtpHost && smtpUser && smtpPass && allRecipients.length > 0) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: allRecipients,
          subject: `[LideraBot Sugerencia/PQRS] ${data.category}: ${data.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f8fafc;">
              <div style="background: #1e3a8a; color: white; padding: 18px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 19px;">Nuevo Mensaje de Estudiante en LideraBot</h2>
                <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Buzón de Mensajes, Sugerencias y PQRS</p>
              </div>
              <p style="font-size: 14px; color: #374151; line-height: 1.5;">
                Un estudiante ha enviado un nuevo mensaje dirigido al equipo docente:
              </p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; background: white; border: 1px solid #e2e8f0; border-radius: 8px;">
                <tr>
                  <td style="padding: 10px 14px; color: #64748b; width: 140px; border-bottom: 1px solid #e2e8f0;"><strong>Estudiante:</strong></td>
                  <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;"><strong>${data.user_name}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; color: #64748b; border-bottom: 1px solid #e2e8f0;"><strong>Correo:</strong></td>
                  <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${data.user_email}" style="color: #1e3a8a;">${data.user_email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; color: #64748b; border-bottom: 1px solid #e2e8f0;"><strong>Categoría:</strong></td>
                  <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;"><span style="background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${data.category}</span></td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; color: #64748b; border-bottom: 1px solid #e2e8f0;"><strong>Asunto:</strong></td>
                  <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; color: #64748b;"><strong>Fecha y hora:</strong></td>
                  <td style="padding: 10px 14px; color: #0f172a;">${new Date().toLocaleString('es-CO')}</td>
                </tr>
              </table>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 18px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase;">
                  Contenido del mensaje:
                </p>
                <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 16px; text-align: center; font-size: 12px; color: #64748b;">
                <p style="margin: 0 0 4px 0;">Este mensaje fue enviado desde el panel de estudiante en LideraBot.</p>
                <p style="margin: 0;">Para más información enviar una pqrs al correo: <a href="mailto:liderabot.app@gmail.com" style="color: #1e3a8a; font-weight: bold;">liderabot.app@gmail.com</a></p>
              </div>
            </div>
          `,
        });
      }
    } catch (mailError) {
      console.error('[SuggestionsService] Error enviando correos a los docentes:', mailError);
    }

    return created;
  }

  async findAll() {
    return this.suggestionModel.find().sort({ created_at: -1 }).lean().exec();
  }

  async findByUser(userId: number) {
    return this.suggestionModel
      .find({ user_id: Number(userId) })
      .sort({ created_at: -1 })
      .lean()
      .exec();
  }

  async updateStatus(id: string, status: string) {
    const updated = await this.suggestionModel
      .findOneAndUpdate({ id }, { status }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Sugerencia con ID ${id} no encontrada.`);
    }
    return updated;
  }
}
