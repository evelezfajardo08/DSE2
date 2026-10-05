import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import { ChatService } from '../chat/chat.service';
import { SubmitActivityAttemptDto } from './dto/submit-activity-attempt.dto';
import { SubmitGeneratedQuizAttemptDto } from './dto/submit-generated-quiz-attempt.dto';
import { ActivityAttempt, ActivityAttemptDocument } from './entities/activity-attempt.schema';
import { ACTIVITY_CATALOG } from './activity.catalog';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(ActivityAttempt.name)
    private readonly attemptModel: Model<ActivityAttemptDocument>,
    private readonly chatService: ChatService,
  ) {}

  findAll() {
    return ACTIVITY_CATALOG;
  }

  findAttemptsByUser(userId: number) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('El usuario no es válido.');
    }

    return this.attemptModel
      .find({ user_id: userId })
      .sort({ submitted_at: -1 })
      .exec();
  }

  async submitAttempt(
    activityId: string,
    userId: number,
    userEmail: string,
    dto: SubmitActivityAttemptDto,
  ) {
    const activity = ACTIVITY_CATALOG.find((candidate) => candidate.id === activityId);
    if (!activity) throw new NotFoundException('No se encontró la actividad.');
    if (!Number.isInteger(Number(userId)) || Number(userId) <= 0) {
      throw new BadRequestException('El usuario no es válido.');
    }
    if (!userEmail?.trim()) throw new BadRequestException('Falta el correo del usuario.');

    const response = String(dto.response || '').trim();
    if (response.length < 10 || response.length > 5000) {
      throw new BadRequestException('La respuesta debe tener entre 10 y 5000 caracteres.');
    }

    let evaluation;
    try {
      evaluation = await this.chatService.evaluateActivityAttempt(activity, response);
    } catch {
      evaluation = {
        score: null,
        feedback: 'Tu respuesta quedó guardada; el análisis automático está temporalmente pendiente.',
        strengths: [],
        nextSteps: [],
        rubricScores: [],
        sources: activity.sources,
        status: 'pending_evaluation' as const,
      };
    }
    const attempt = new this.attemptModel({
      id: randomUUID(),
      user_id: Number(userId),
      user_email: userEmail.trim().toLowerCase(),
      activity_id: activity.id,
      skill: activity.skill,
      activity_title: activity.title,
      response,
      ...evaluation,
      submitted_at: new Date(),
    });

    return attempt.save();
  }

  async submitGeneratedQuizAttempt(
    userId: number,
    userEmail: string,
    dto: SubmitGeneratedQuizAttemptDto,
  ) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('El usuario no es válido.');
    }
    if (!dto.quizId?.trim() || !dto.title?.trim()) {
      throw new BadRequestException('Faltan los datos del cuestionario.');
    }
    if (!Number.isFinite(dto.score) || !Number.isFinite(dto.maxScore) || dto.maxScore <= 0
      || dto.score < 0 || dto.score > dto.maxScore) {
      throw new BadRequestException('La puntuación del cuestionario no es válida.');
    }
    if (!dto.response?.trim() || dto.response.length > 10000) {
      throw new BadRequestException('Las respuestas del cuestionario no son válidas.');
    }

    const score = Math.round((dto.score / dto.maxScore) * 100);
    const attempt = new this.attemptModel({
      id: randomUUID(),
      user_id: userId,
      user_email: userEmail.trim().toLowerCase(),
      activity_id: `generated:${dto.quizId}`,
      skill: dto.skill || 'leadership',
      activity_title: dto.title.trim(),
      response: dto.response,
      score,
      feedback: `Resultado del cuestionario: ${score}/100. Revisa las explicaciones de las preguntas para decidir qué practicar después.`,
      strengths: score >= 80 ? ['Buen dominio de las respuestas del cuestionario.'] : [],
      next_steps: score < 80 ? ['Revisa las explicaciones e intenta una actividad relacionada con esta habilidad.'] : [],
      sources: Array.isArray(dto.sourceCitations)
        ? dto.sourceCitations.filter((source) => typeof source === 'string').slice(0, 10)
        : [],
      rubric_scores: [],
      status: 'evaluated',
      submitted_at: new Date(),
    });

    return attempt.save();
  }
}