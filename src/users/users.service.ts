import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/schema';
import { Progress, ProgressDocument } from '../progress/entities/schema';
import { Result, ResultDocument } from '../results/entities/schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Progress.name)
    private readonly progressModel: Model<ProgressDocument>,
    @InjectModel(Result.name)
    private readonly resultModel: Model<ResultDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findStudents() {
    return this.userModel
      .find({ role: 'student' })
      .select('-_id id name email status registered_at last_connection lastLoginDate')
      .sort({ name: 1 })
      .lean()
      .exec();
  }

  async findRegisteredUsers() {
    return this.userModel
      .find({ emailVerified: true, status: 'active' })
      .select('-_id id name email role status registered_at last_connection lastLoginDate loginStreak')
      .sort({ role: 1, name: 1 })
      .lean()
      .exec();
  }

  async findTeacherApprovalRequests() {
    return this.userModel
      .find({ role: 'teacher', status: 'pending_approval', emailVerified: true })
      .select('id name email registered_at last_connection lastLoginDate')
      .sort({ registered_at: 1 })
      .lean()
      .exec();
  }

  async findOne(id: number) {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async updateLastConnection(id: number) {
    return this.userModel
      .findOneAndUpdate({ id }, { last_connection: new Date() }, { new: true })
      .exec();
  }

  async recordLogin(id: number) {
    const user = await this.findOne(id);
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = today.slice(0, 7);

    if (user.lastLoginDate === today) {
      return this.userModel
        .findOneAndUpdate({ id }, { last_connection: new Date() }, { new: true })
        .exec();
    }

    const lastLogin = user.lastLoginDate ? new Date(`${user.lastLoginDate}T00:00:00Z`) : null;
    const todayDate = new Date(`${today}T00:00:00Z`);
    const elapsedDays = lastLogin
      ? Math.round((todayDate.getTime() - lastLogin.getTime()) / (24 * 60 * 60 * 1000))
      : null;
    const previousStreak = user.loginStreak || 0;
    const canRecoverStreak = elapsedDays === 2 && user.streakRecoveryMonth !== currentMonth;
    const loginStreak = elapsedDays === 1
      ? previousStreak + 1
      : canRecoverStreak
        ? previousStreak
        : 1;

    return this.userModel
      .findOneAndUpdate(
        { id },
        {
          loginStreak,
          lastLoginDate: today,
          last_connection: new Date(),
          ...(canRecoverStreak ? { streakRecoveryMonth: currentMonth } : {}),
        },
        { new: true },
      )
      .exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findOneAndUpdate({ id }, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async approveTeacher(id: number) {
    const user = await this.userModel
      .findOneAndUpdate(
        { id, role: 'teacher', status: 'pending_approval', emailVerified: true },
        { status: 'active' },
        { new: true },
      )
      .exec();
    if (!user) {
      throw new NotFoundException('No se encontró una solicitud docente pendiente.');
    }
    return user;
  }

  async remove(id: number) {
    const user = await this.userModel.findOneAndDelete({ id }).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.progressModel.deleteMany({ user_id: id }).exec();
    await this.resultModel.deleteMany({ user_id: id }).exec();
    return user;
  }

  async removeUserWithNotification(id: number, reason: string, teacherName: string) {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    // Enviar notificación de eliminación por correo electrónico
    try {
      const smtpPort = Number(process.env.SMTP_PORT ?? 465);
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@liderabot.local';
      const senderFrom = `"LideraBot" <${smtpFrom}>`;

      if (smtpUser && smtpPass && user.email) {
        const transporter =
          smtpHost === 'smtp.gmail.com'
            ? nodemailer.createTransport({
                service: 'gmail',
                auth: { user: smtpUser, pass: smtpPass },
              })
            : nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: { user: smtpUser, pass: smtpPass },
              });

        await transporter.sendMail({
          from: senderFrom,
          to: user.email,
          subject: 'Notificación de eliminación de cuenta - LideraBot',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
              <div style="background-color: #dc2626; padding: 16px; border-radius: 8px; color: #ffffff; text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 20px;">Notificación de Eliminación de Cuenta</h2>
                <p style="margin: 5px 0 0 0; font-size: 13px;">Plataforma Educativa LideraBot</p>
              </div>
              <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                Hola <strong>${user.name}</strong>,
              </p>
              <p style="color: #374151; font-size: 14px; line-height: 1.6;">
                Te informamos que tu cuenta registrada con el correo <strong>${user.email}</strong> ha sido eliminada del sistema por el equipo docente de la plataforma.
              </p>
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 12px; font-weight: bold; color: #991b1b; text-transform: uppercase;">
                  Motivo de la eliminación:
                </p>
                <p style="margin: 6px 0 0 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">
                  ${reason || 'Sin motivo especificado'}
                </p>
              </div>
              <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
                Docente que gestionó la acción: <strong>${teacherName || 'Equipo Docente'}</strong><br />
                Fecha de gestión: <strong>${new Date().toLocaleString('es-CO')}</strong>
              </p>
              <div style="border-top: 1px solid #e5e7eb; margin-top: 24px; padding-top: 16px; text-align: center;">
                <p style="color: #4b5563; font-size: 12px; margin: 0 0 6px 0;">
                  Para más información enviar una pqrs al correo:
                </p>
                <a href="mailto:liderabot.app@gmail.com" style="color: #1e3a8a; font-weight: bold; text-decoration: none; font-size: 13px;">
                  liderabot.app@gmail.com
                </a>
              </div>
            </div>
          `,
        });
      }
    } catch (mailError) {
      console.error('[UsersService] Error enviando correo de eliminación:', mailError);
    }

    // Eliminar registros asociados en cascada
    await this.progressModel.deleteMany({ user_id: id }).exec();
    await this.resultModel.deleteMany({ user_id: id }).exec();
    await this.userModel.findOneAndDelete({ id }).exec();

    return {
      success: true,
      message: `Usuario ${user.name} (${user.email}) eliminado y notificado correctamente por correo.`,
    };
  }
}
