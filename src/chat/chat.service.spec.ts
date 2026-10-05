import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    service = new ChatService(new ConfigService({
      GEMINI_API_KEY: 'test-key',
      GEMINI_MODEL: 'gemini-flash-latest',
    }));
  });

  it('no incluye datos personales ni de progreso en el saludo', async () => {
    const chunks: any[] = [];

    await service.streamReply('hola', (chunk) => chunks.push(chunk), {
      completedActivitiesCount: 1,
      progressPercent: 100,
      lastActivityTitle: 'Actividad privada',
      skills: { liderazgo: 50 },
    });

    expect(chunks[0].payload).toBe(
      '¡Hola! Soy LideraBot. Estoy aquí para ayudarte con liderazgo, comunicación, toma de decisiones y ejercicios prácticos. ¿En qué te puedo apoyar?',
    );
    expect(chunks[0].payload).not.toContain('Actividad privada');
    expect(chunks[0].payload).not.toContain('100%');
  });

  it('incluye las fuentes recuperadas por Gemini en la respuesta', async () => {
    const chunks: any[] = [];
    jest.spyOn(service as any, 'generateGroundedResponse').mockResolvedValue({
      text: 'Escucha las distintas perspectivas antes de decidir.',
      sources: ['base-conocimiento-liderazgo.md'],
    });

    await service.streamReply('¿Cómo puedo decidir en equipo?', (chunk) => chunks.push(chunk));

    expect(chunks[0].payload).toContain('Escucha las distintas perspectivas');
    expect(chunks[0].payload).toContain('Referencia: base-conocimiento-liderazgo.md');
  });

  it('responde desde la base local cuando Gemini alcanza su cuota diaria', async () => {
    const chunks: any[] = [];
    jest.spyOn(service as any, 'generateGroundedResponse').mockRejectedValue({
      status: 429,
      error: { code: 'too_many_requests' },
    });

    await service.streamReply(
      '¿Cuáles son las cuatro dimensiones del liderazgo transformacional?',
      (chunk) => chunks.push(chunk),
    );

    expect(chunks[0].payload).toContain('Gemini alcanzó el límite diario de solicitudes');
    expect(chunks[0].payload).toContain('modelar con el ejemplo');
    expect(chunks[0].payload).toContain('Impacto del liderazgo transformacional');
  });

  it('usa la conversación y el catálogo para recomendar una actividad existente', async () => {
    const chunks: any[] = [];
    const generate = jest.spyOn(service as any, 'generateGroundedResponse').mockResolvedValue({
      text: 'Te recomiendo Retroalimentación clara y respetuosa para practicarlo.',
      sources: ['base-conocimiento-liderazgo.md'],
    });

    await service.streamReply(
      '¿Qué actividad me recomiendas?',
      (chunk) => chunks.push(chunk),
      { completedActivitiesCount: 1, skillScores: { communication: 52 } },
      [{ role: 'user', content: 'Me cuesta decirle a mi compañero que entregue a tiempo.' }],
    );

    expect(generate.mock.calls[0][0]).toContain('Me cuesta decirle a mi compañero');
    expect(generate.mock.calls[0][0]).toContain('Retroalimentación clara y respetuosa');
    expect(generate.mock.calls[0][1]).toContain('títulos exactos entre comillas');
    expect(chunks[0].payload).toContain('Referencia: base-conocimiento-liderazgo.md');
  });

  it('no genera un cuestionario cuando el estudiante solo pide una recomendación', () => {
    expect((service as any).getRequestedActivityType('¿Qué actividad me recomiendas para mejorar comunicación?')).toBeNull();
  });

  it('extrae un quiz JSON aunque Gemini responda con texto y bloques markdown', () => {
    const rawText = `Claro, aquí tienes una actividad para practicar liderazgo.

\`\`\`json
{
  "title": "Liderazgo bajo presión",
  "description": "Evalúa cómo actuar ante decisiones difíciles.",
  "category": "leadership",
  "difficulty": "intermediate",
  "questions": [
    {
      "question": "¿Cuál es la mejor primera acción ante un conflicto de equipo?",
      "options": [
        "Escuchar a cada persona antes de decidir",
        "Imponer la decisión del líder",
        "Evitar el conflicto",
        "Delegar sin analizar"
      ],
      "correctIndex": 0,
      "explanation": "Escuchar permite entender la causa del conflicto antes de actuar.",
      "points": 10
    }
  ]
}
\`\`

Espero que te sirva.`;

    const quiz = (service as any).parseQuizJson(rawText);

    expect(quiz).not.toBeNull();
    expect(quiz.title).toBe('Liderazgo bajo presión');
    expect(quiz.questions).toHaveLength(1);
    expect(quiz.questions[0].correctIndex).toBe(0);
  });
});
