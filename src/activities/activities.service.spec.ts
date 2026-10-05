import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

describe('ActivitiesService', () => {
  const save = jest.fn();
  const find = jest.fn();
  const evaluateActivityAttempt = jest.fn();
  let service: ActivitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    const model = Object.assign(
      jest.fn((data) => ({ ...data, save })),
      { find },
    );
    service = new ActivitiesService(model as any, { evaluateActivityAttempt } as any);
  });

  it('ofrece seis actividades guiadas con objetivos y rúbricas', () => {
    const activities = service.findAll();

    expect(activities).toHaveLength(6);
    expect(activities.every((activity) => activity.rubric.length > 0 && activity.sources.length > 0)).toBe(true);
  });

  it('rechaza actividades que no están en el catálogo', async () => {
    await expect(service.submitAttempt('unknown', 1, 'student@example.com', {
      response: 'Esta es una respuesta de prueba.',
    })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('valida la respuesta antes de evaluarla', async () => {
    await expect(service.submitAttempt('assertive-feedback', 1, 'student@example.com', {
      response: 'corto',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(evaluateActivityAttempt).not.toHaveBeenCalled();
  });

  it('guarda la respuesta, evaluación y referencias recuperadas', async () => {
    evaluateActivityAttempt.mockResolvedValue({
      score: 82,
      feedback: 'Buena escucha y propuesta concreta.',
      strengths: ['Escucha activa'],
      nextSteps: ['Define una fecha de revisión.'],
      rubricScores: [],
      sources: ['base-conocimiento-liderazgo.md'],
      status: 'evaluated',
    });
    save.mockImplementation(function (this: any) { return Promise.resolve(this); });

    const attempt = await service.submitAttempt('assertive-feedback', 7, 'Student@Example.com', {
      response: 'Primero escucharía sus razones y luego acordaría una fecha común.',
    });

    expect(attempt.user_id).toBe(7);
    expect(attempt.user_email).toBe('student@example.com');
    expect(attempt.score).toBe(82);
    expect(attempt.sources).toEqual(['base-conocimiento-liderazgo.md']);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('persiste el puntaje porcentual de un cuestionario generado', async () => {
    save.mockImplementation(function (this: any) { return Promise.resolve(this); });

    const attempt = await service.submitGeneratedQuizAttempt(3, 'student@example.com', {
      quizId: 'quiz-1',
      title: 'Decisiones en equipo',
      skill: 'decision',
      score: 24,
      maxScore: 30,
      response: '[{"question":1,"selectedIndex":2}]',
      sourceCitations: ['base-conocimiento-liderazgo.md'],
    });

    expect(attempt.activity_id).toBe('generated:quiz-1');
    expect(attempt.score).toBe(80);
    expect(attempt.sources).toEqual(['base-conocimiento-liderazgo.md']);
  });
});