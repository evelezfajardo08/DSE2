import { Controller, Post, Body, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('profile')
  updateProfile(@Body() body: any) {
    return this.authService.updateProfile(body);
  }

  @Post('change-password')
  changePassword(@Body() body: any) {
    return this.authService.changePassword(body);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: any) {
    return this.authService.verifyEmail(body);
  }

  @Post('resend-verification')
  resendEmailVerification(@Body() body: any) {
    return this.authService.resendEmailVerification(body);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: any) {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body);
  }

  @Patch('teacher-requests/:id/approve')
  @UseGuards(JwtAuthGuard)
  approveTeacher(@Req() request: any, @Param('id') id: string) {
    return this.authService.approveTeacher(request.user, +id);
  }
}
