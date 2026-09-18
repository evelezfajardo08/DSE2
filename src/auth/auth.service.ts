import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private readonly passwordResetTokens = new Map<
    string,
    { email: string; expiresAt: number }
  >();
  private readonly forgotPasswordCooldowns = new Map<string, number>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private async sendPasswordResetEmail(email: string, code: string) {
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@liderabot.local';

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn(
        `[Auth] Gmail SMTP no configurado. Código de recuperación para ${email}: ${code}`
      );
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(code)}`;

    await transporter.sendMail({
      from: smtpFrom,
      to: email,
      subject: 'Recupera tu contraseña - LideraBot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f8fafc;">
          <h2 style="color: #1e3a8a; margin-bottom: 12px;">Recupera tu contraseña</h2>
          <p style="color: #374151; line-height: 1.6;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en LideraBot.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Tu código de verificación es: <strong>${code}</strong>
          </p>
          <p style="color: #374151; line-height: 1.6;">
            También puedes usar este enlace: <a href="${resetLink}" style="color: #1e3a8a;">Restablecer contraseña</a>
          </p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            Este código expira en 15 minutos.
          </p>
        </div>
      `,
    });
  }

  private async sendEmailVerificationEmail(email: string, code: string) {
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@liderabot.local';

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error('Gmail SMTP no está configurado.');
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: email,
      subject: 'Verifica tu correo - LideraBot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f8fafc;">
          <h2 style="color: #1e3a8a;">Verifica tu correo electrónico</h2>
          <p style="color: #374151; line-height: 1.6;">Usa este código para activar tu cuenta de LideraBot:</p>
          <p style="font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #1e3a8a;">${code}</p>
          <p style="color: #6b7280; font-size: 12px;">Este código expira en 15 minutos.</p>
        </div>
      `,
    });
  }

  private async sendTeacherApprovalEmail(email: string) {
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@liderabot.local';

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error('Gmail SMTP no está configurado.');
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: email,
      subject: 'Tu cuenta docente fue aprobada - LideraBot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f8fafc;">
          <h2 style="color: #1e3a8a;">¡Tu solicitud fue aprobada!</h2>
          <p style="color: #374151; line-height: 1.6;">Un docente de LideraBot aprobó tu solicitud. Ya puedes iniciar sesión como docente en la aplicación.</p>
        </div>
      `,
    });
  }

  async register(data: any) {
    const email = String(data.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/.test(email)) {
      throw new BadRequestException(
        'Solo puedes registrarte con una cuenta de correo @gmail.com.'
      );
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      if (existingUser.emailVerified === false) {
        throw new ConflictException('Este correo ya tiene un registro pendiente. Revisa tu correo e ingresa el código de verificación.');
      }
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = Math.floor(Math.random() * 1000000);
    const verificationCode = crypto.randomInt(100000, 1000000).toString();

    const newUser = await this.usersService.create({
      id: userId,
      name: data.name,
      email,
      password: hashedPassword,
      role: data.role || 'student',
      status: 'pending',
      emailVerified: false,
      emailVerificationCodeHash: crypto.createHash('sha256').update(verificationCode).digest('hex'),
      emailVerificationExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    try {
      await this.sendEmailVerificationEmail(email, verificationCode);
    } catch (error) {
      await this.usersService.remove(userId);
      throw new BadRequestException('No se pudo enviar el código de verificación. Intenta nuevamente.');
    }

    return {
      message: 'Revisa la bandeja de entrada de tu correo para obtener el código de verificación.',
    };
  }

  async resendEmailVerification(data: any) {
    const email = String(data.email || '').trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user || user.emailVerified !== false) {
      throw new BadRequestException('No hay un registro pendiente para este correo.');
    }

    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    await this.sendEmailVerificationEmail(email, verificationCode);

    await this.usersService.update(user.id, {
      emailVerificationCodeHash: crypto.createHash('sha256').update(verificationCode).digest('hex'),
      emailVerificationExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    return {
      message: 'Revisa la bandeja de entrada de tu correo para obtener el nuevo código de verificación.',
    };
  }

  async login(data: any) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const requestedRole = String(data.role || user.role || 'student').toLowerCase();
    const actualRole = String(user.role || 'student').toLowerCase();

    if (user.emailVerified === false) {
      throw new UnauthorizedException('Debes verificar tu correo antes de iniciar sesión.');
    }

    if (actualRole === 'teacher' && user.status !== 'active') {
      throw new UnauthorizedException('Tu solicitud docente está pendiente de aprobación.');
    }

    if (actualRole !== requestedRole) {
      const expectedRoleLabel = actualRole === 'teacher' ? 'docente' : 'estudiante';
      throw new UnauthorizedException(
        `Este usuario está registrado como ${expectedRoleLabel}. Debes iniciar sesión desde el login de ${expectedRoleLabel}.`
      );
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateToken(user);
  }

  async updateProfile(data: any) {
    const email = String(data.email || '').trim().toLowerCase();
    const name = String(data.name || '').trim();
    if (!email || !name) {
      throw new BadRequestException('El nombre y el correo son obligatorios.');
    }
    if (name.length < 2) {
      throw new BadRequestException('El nombre debe tener al menos 2 caracteres.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('No se encontró la cuenta.');
    }

    const updatedUser = await this.usersService.update(user.id, { name });
    return { name: updatedUser.name, email: updatedUser.email };
  }

  async changePassword(data: any) {
    const email = String(data.email || '').trim().toLowerCase();
    const currentPassword = String(data.current_password || '');
    const newPassword = String(data.new_password || '');
    if (!email || !currentPassword || !newPassword) {
      throw new BadRequestException('Completa todos los campos de contraseña.');
    }
    if (newPassword.length < 6) {
      throw new BadRequestException('La nueva contraseña debe tener al menos 6 caracteres.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new UnauthorizedException('La contraseña actual no es correcta.');
    }

    await this.usersService.update(user.id, {
      password: await bcrypt.hash(newPassword, 10),
    });
    return { message: 'La contraseña se cambió correctamente.' };
  }

  async verifyEmail(data: any) {
    const email = String(data.email || '').trim().toLowerCase();
    const code = String(data.code || '').trim();
    const user = await this.usersService.findByEmail(email);

    if (!user || user.emailVerified) {
      throw new UnauthorizedException('El código de verificación es inválido.');
    }

    if (!user.emailVerificationExpiresAt || Date.now() > user.emailVerificationExpiresAt.getTime()) {
      throw new UnauthorizedException('El código de verificación ha expirado. Regístrate nuevamente.');
    }

    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    if (codeHash !== user.emailVerificationCodeHash) {
      throw new UnauthorizedException('El código de verificación es inválido.');
    }

    const isTeacher = String(user.role || '').toLowerCase() === 'teacher';
    const verifiedUser = await this.usersService.update(user.id, {
      emailVerified: true,
      status: isTeacher ? 'pending_approval' : 'active',
      emailVerificationCodeHash: undefined,
      emailVerificationExpiresAt: undefined,
    });

    if (isTeacher) {
      return {
        approval_required: true,
        message: 'Correo verificado. Un docente debe aprobar tu solicitud antes de activar la cuenta.',
        user: {
          name: verifiedUser.name,
          email: verifiedUser.email,
          role: verifiedUser.role,
        },
      };
    }

    return this.generateToken(verifiedUser);
  }

  async approveTeacher(requester: any, id: number) {
    const approver = await this.usersService.findByEmail(String(requester.email || '').toLowerCase());
    if (!approver || approver.role !== 'teacher' || approver.status !== 'active' || !approver.emailVerified) {
      throw new UnauthorizedException('Solo un docente activo puede aprobar solicitudes.');
    }

    const approvedUser = await this.usersService.approveTeacher(id);
    try {
      await this.sendTeacherApprovalEmail(approvedUser.email);
    } catch (error) {
      console.warn('[Auth] La cuenta fue aprobada, pero no se pudo enviar el correo:', error);
    }

    return {
      message: 'La solicitud docente fue aprobada.',
      user: {
        id: approvedUser.id,
        name: approvedUser.name,
        email: approvedUser.email,
      },
    };
  }

  async forgotPassword(data: any) {
    const email = String(data.email || '').trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return {
        message: 'Si el correo está asociado a una cuenta, recibirás instrucciones para restablecer la contraseña.',
      };
    }

    const role = String(data.role || user.role || 'student').toLowerCase();
    const actualRole = String(user.role || 'student').toLowerCase();

    if (actualRole !== role) {
      return {
        message: 'Si el correo está asociado a una cuenta, recibirás instrucciones para restablecer la contraseña.',
      };
    }

    const now = Date.now();
    const lastRequestAt = this.forgotPasswordCooldowns.get(email);
    if (lastRequestAt && now - lastRequestAt < 60 * 1000) {
      return {
        message: 'Si el correo está asociado a una cuenta, recibirás instrucciones para restablecer la contraseña.',
      };
    }
    this.forgotPasswordCooldowns.set(email, now);

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    this.passwordResetTokens.set(resetCode, { email: user.email, expiresAt });

    try {
      await this.sendPasswordResetEmail(user.email, resetCode);
    } catch (error) {
      console.warn('[Auth] No se pudo enviar el correo de recuperación:', error);
    }

    return {
      message: 'Si el correo está asociado a una cuenta, recibirás instrucciones para restablecer la contraseña.',
    };
  }

  async resetPassword(data: any) {
    const email = String(data.email || '').trim().toLowerCase();
    const token = String(data.reset_token || '').trim();
    const newPassword = String(data.new_password || '').trim();

    if (!email || !token || !newPassword) {
      throw new UnauthorizedException('Faltan datos para restablecer la contraseña.');
    }

    const resetTokenEntry = this.passwordResetTokens.get(token);
    if (!resetTokenEntry || resetTokenEntry.email !== email) {
      throw new UnauthorizedException('El código de recuperación es inválido o ya no existe.');
    }

    if (Date.now() > resetTokenEntry.expiresAt) {
      this.passwordResetTokens.delete(token);
      throw new UnauthorizedException('El código de recuperación ha expirado. Solicita uno nuevo.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('No se encontró la cuenta asociada a ese correo.');
    }

    if (newPassword.length < 6) {
      throw new UnauthorizedException('La nueva contraseña debe tener al menos 6 caracteres.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, { password: hashedPassword });
    this.passwordResetTokens.delete(token);
    this.forgotPasswordCooldowns.delete(email);

    return {
      message: 'La contraseña se restableció correctamente.',
    };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
