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

  private getMailTransporter() {
    const smtpPort = Number(process.env.SMTP_PORT ?? 465);
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      throw new Error('Gmail SMTP no está configurado (faltan credenciales).');
    }

    if (smtpHost === 'smtp.gmail.com') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });
    }

    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
  }

  private async sendPasswordResetEmail(email: string, code: string) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@liderabot.local';
    const senderFrom = `"LideraBot" <${smtpFrom}>`;

    if (!smtpUser || !smtpPass) {
      console.warn(
        `[Auth] Gmail SMTP no configurado. Código de recuperación para ${email}: ${code}`
      );
      return;
    }

    const transporter = this.getMailTransporter();
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(code)}`;

    await transporter.sendMail({
      from: senderFrom,
      to: email,
      subject: 'Restablecimiento de contraseña - LideraBot',
      text: `Hola,\n\nHemos recibido una solicitud para restablecer la contraseña de tu cuenta en la plataforma educativa LideraBot.\n\nTu código de recuperación es: ${code}\n\nEste código es confidencial y vence en 15 minutos.\n\nTambién puedes restablecer tu contraseña desde el siguiente enlace directo:\n${resetLink}\n\nSi no realizaste esta solicitud, puedes ignorar este mensaje de forma segura.\n\nAtentamente,\nEquipo de Formación y Soporte LideraBot\nContacto institucional: liderabot.app@gmail.com`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #0F3B8F; color: #ffffff; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 18px; letter-spacing: 0.5px;">
              LIDERA<span style="color: #FACC15;">BOT</span>
            </div>
            <p style="margin: 8px 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Plataforma Educativa y Formación en Liderazgo</p>
          </div>

          <h2 style="color: #0F3B8F; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">Restablece tu contraseña</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
            Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta en LideraBot.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Tu código de seguridad es:</p>
            <div style="font-size: 32px; letter-spacing: 8px; font-weight: 800; color: #0F3B8F; font-family: monospace; padding: 8px 0;">
              ${code}
            </div>
            <p style="color: #dc2626; font-size: 12px; font-weight: 500; margin: 8px 0 0 0;">
              ⏱ Este código es confidencial y expira en 15 minutos.
            </p>
          </div>

          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            También puedes ingresar directamente para cambiarla haciendo clic en el siguiente enlace:
          </p>
          <div style="text-align: center; margin: 20px 0 28px 0;">
            <a href="${resetLink}" style="background-color: #0F3B8F; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
              Restablecer mi Contraseña
            </a>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 20px; margin: 0;">
            Si tú no solicitaste este cambio, no te preocupes: tu cuenta permanece segura y puedes desestimar este mensaje.<br /><br />
            Para dudas o inquietudes, puedes comunicarte con nosotros a: <a href="mailto:liderabot.app@gmail.com" style="color: #0F3B8F; text-decoration: underline;">liderabot.app@gmail.com</a>
          </p>
        </div>
      `,
    });
  }

  private async sendEmailVerificationEmail(email: string, code: string) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@liderabot.local';
    const senderFrom = `"LideraBot" <${smtpFrom}>`;

    if (!smtpUser || !smtpPass) {
      throw new Error('Gmail SMTP no está configurado (faltan credenciales).');
    }

    const transporter = this.getMailTransporter();

    await transporter.sendMail({
      from: senderFrom,
      to: email,
      subject: 'Código de verificación de tu cuenta - LideraBot',
      text: `¡Bienvenido/a a LideraBot!\n\nGracias por unirte a nuestra plataforma educativa de liderazgo. Para completar la activación de tu cuenta de forma segura, ingresa el siguiente código de verificación:\n\n${code}\n\nEste código vence en 15 minutos.\n\nSi no te has registrado en LideraBot, ignora este correo.\n\nAtentamente,\nEquipo de Formación y Soporte LideraBot\nContacto institucional: liderabot.app@gmail.com`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #0F3B8F; color: #ffffff; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 18px; letter-spacing: 0.5px;">
              LIDERA<span style="color: #FACC15;">BOT</span>
            </div>
            <p style="margin: 8px 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Plataforma Educativa y Formación en Liderazgo</p>
          </div>

          <h2 style="color: #0F3B8F; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">¡Bienvenido/a a LideraBot!</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
            Gracias por comenzar tu proceso formativo en liderazgo con nosotros. Para validar tu dirección de correo electrónico y proteger tu acceso, utiliza el siguiente código de confirmación:
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
            <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Código de verificación</p>
            <div style="font-size: 34px; letter-spacing: 8px; font-weight: 800; color: #0F3B8F; font-family: monospace; padding: 6px 0;">
              ${code}
            </div>
            <p style="color: #dc2626; font-size: 12px; font-weight: 500; margin: 8px 0 0 0;">
              ⏱ Este código es de uso personal y expira en 15 minutos.
            </p>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
              <strong>Paso siguiente:</strong> Copia o digita los 6 dígitos en la ventana de registro de LideraBot para ingresar de inmediato al módulo inicial y a la prueba diagnóstica.
            </p>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 20px; margin: 24px 0 0 0;">
            Si tú no solicitaste el registro en LideraBot, puedes desestimar este mensaje de forma segura.<br /><br />
            Para más información, solicitudes o PQRS, escríbenos a: <a href="mailto:liderabot.app@gmail.com" style="color: #0F3B8F; text-decoration: underline;">liderabot.app@gmail.com</a>
          </p>
        </div>
      `,
    });
  }

  private async sendTeacherApprovalEmail(email: string) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@liderabot.local';
    const senderFrom = `"LideraBot" <${smtpFrom}>`;

    if (!smtpUser || !smtpPass) {
      throw new Error('Gmail SMTP no está configurado (faltan credenciales).');
    }

    const transporter = this.getMailTransporter();

    await transporter.sendMail({
      from: senderFrom,
      to: email,
      subject: 'Tu cuenta docente fue aprobada - LideraBot',
      text: `¡Felicidades!\n\nUn docente administrador de LideraBot ha aprobado tu cuenta con rol docente.\n\nYa puedes acceder a la plataforma para gestionar tus cursos, monitorear el progreso por habilidades de los estudiantes y revisar el buzón de sugerencias.\n\nInicia sesión en: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n\nAtentamente,\nEquipo de LideraBot`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #0F3B8F; color: #ffffff; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 18px; letter-spacing: 0.5px;">
              LIDERA<span style="color: #FACC15;">BOT</span>
            </div>
            <p style="margin: 8px 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Plataforma Educativa y Formación en Liderazgo</p>
          </div>

          <h2 style="color: #166534; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">¡Tu solicitud docente ha sido aprobada!</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
            El equipo administrador de LideraBot ha revisado y habilitado tu perfil con rol de <strong>Docente</strong>. A partir de este momento puedes acceder al panel de gestión académica.
          </p>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
              ✓ Acceso a monitoreo de progreso grupal en tiempo real<br />
              ✓ Gestión de estudiantes y revisión de actividades<br />
              ✓ Buzón de mensajes, sugerencias y PQRS
            </p>
          </div>

          <div style="text-align: center; margin: 28px 0 20px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #0F3B8F; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
              Ingresar al Panel Docente
            </a>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 20px; margin: 24px 0 0 0;">
            Si necesitas asistencia institucional, puedes contactarnos en: <a href="mailto:liderabot.app@gmail.com" style="color: #0F3B8F; text-decoration: underline;">liderabot.app@gmail.com</a>
          </p>
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

    const userWithLogin = actualRole === 'student'
      ? await this.usersService.recordLogin(user.id)
      : user;

    return this.generateToken(userWithLogin);
  }

  async getCurrentUser(payload: any) {
    const user = await this.usersService.findByEmail(String(payload.email || '').toLowerCase());
    if (!user || user.emailVerified === false || (user.role === 'teacher' && user.status !== 'active')) {
      throw new UnauthorizedException('La sesión no es válida o ha expirado.');
    }

    // Actualizar marca de última conexión en tiempo real
    this.usersService.updateLastConnection(user.id).catch(() => undefined);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      currentStreak: user.loginStreak || 0,
      last_connection: user.last_connection || new Date(),
    };
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
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentStreak: user.loginStreak || 0,
      }
    };
  }
}
