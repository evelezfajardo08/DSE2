import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { SubmitActivityAttemptDto } from './dto/submit-activity-attempt.dto';
import { SubmitGeneratedQuizAttemptDto } from './dto/submit-generated-quiz-attempt.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get('attempts/me')
  @UseGuards(JwtAuthGuard)
  findMyAttempts(@Req() request: any) {
    return this.activitiesService.findAttemptsByUser(Number(request.user.sub));
  }

  @Post(':activityId/attempts')
  @UseGuards(JwtAuthGuard)
  submitAttempt(
    @Param('activityId') activityId: string,
    @Body() dto: SubmitActivityAttemptDto,
    @Req() request: any,
  ) {
    return this.activitiesService.submitAttempt(
      activityId,
      Number(request.user.sub),
      request.user.email,
      dto,
    );
  }

  @Post('generated-attempts')
  @UseGuards(JwtAuthGuard)
  submitGeneratedQuizAttempt(
    @Body() dto: SubmitGeneratedQuizAttemptDto,
    @Req() request: any,
  ) {
    return this.activitiesService.submitGeneratedQuizAttempt(
      Number(request.user.sub),
      request.user.email,
      dto,
    );
  }
}