import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ActivityDefinition, ActivityEvaluation } from '../activities/activity.types';
import { ACTIVITY_CATALOG } from '../activities/activity.catalog';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  points?: number;
}

interface GeneratedQuiz {z
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  questions: QuizQuestion[];
  sourceCitations?: string[];
}

interface ChatHistoryEntry {
  role: 'assistant' | 'user';
  content: string;
}

interface GroundedResponse {
  text: string;
  sources: string[];
}

@Injectable()
export class ChatService {
  constructor(private readonly configService: ConfigService) {}

  private isUnsupportedRequest(message: string): boolean {
    const text = message.toLowerCase();
    const unsupportedPatterns = [
      'genera una imagen',
      'haz una imagen',
      'crear una imagen',
      'genera una foto',
      'haz una foto',
      'quiero ver una imagen',
      'imagen de',
      'dibuja',
      'ilustración',
      'grafico',
      'gráfica',
      'logo',
      'portada',
    ];

    return unsupportedPatterns.some((pattern) => text.includes(pattern));
  }

  private isGreeting(message: string): boolean {
    const text = message.toLowerCase().trim();
    const greetingPatterns = [
      'hola',
      'buenos días',
      'buenas tardes',
      'buenas noches',
      'saludos',
      'hi',
      'hello',
    ];

    return greetingPatterns.some((pattern) => text === pattern || text.startsWith(pattern));
  }

  private getRequestedActivityType(message: string): 'quiz' | 'crossword' | 'word-search' | null {
    const text = message.toLowerCase();

    if (/(crucigrama|crossword)/i.test(text)) return 'crossword';
    if (/(sopa de letras|sopa de letras|word search|word-search)/i.test(text)) return 'word-search';

    const quizPatterns = [
      'cuestionario',
      'quiz',
      'actividad',
      'ejercicio',
      'preguntas',
      'evaluacion',
      'evaluación',
      'test',
      'reto',
      'prueba',
    ];

    const actionPattern = /(genera|crea|haz|hazme|quiero|dame|prep[aá]rate|make|create|generate)/i;
    if (actionPattern.test(message) && quizPatterns.some((pattern) => text.includes(pattern))) {
      return 'quiz';
    }

    return null;
  }

  private looksLikeQuizRequest(message: string): boolean {
    return this.getRequestedActivityType(message) !== null;
  }

  private parseQuizJson(rawText: string): GeneratedQuiz | null {
    const trimmed = rawText.trim();
    const candidates: string[] = [];

    if (!trimmed) return null;

    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
    if (fenced) candidates.push(fenced.trim());

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
    }

    candidates.push(trimmed);

    for (const candidate of candidates) {
      const cleaned = candidate
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      if (!cleaned) continue;

      try {
        const parsed = JSON.parse(cleaned);
        if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          continue;
        }

        return {
          title: parsed.title || 'Actividad de liderazgo',
          description: parsed.description || 'Actividad para practicar liderazgo y comunicación.',
          category: parsed.category || 'leadership',
          difficulty: parsed.difficulty || 'intermediate',
          questions: parsed.questions.map((question: any) => ({
            question: question.question || 'Pregunta sin enunciado',
            options: Array.isArray(question.options) ? question.options.slice(0, 4) : [],
            correctIndex: Number.isInteger(question.correctIndex) ? question.correctIndex : 0,
            explanation: question.explanation || 'Revisa la respuesta correcta y su justificación.',
            points: typeof question.points === 'number' ? question.points : 10,
          })),
        } as GeneratedQuiz;
      } catch {
        continue;
      }
    }

    return null;
  }

  private async generateGroundedResponse(
    prompt: string,
    systemInstruction: string,
  ): Promise<GroundedResponse> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Gemini no está configurado. Agrega GEMINI_API_KEY al archivo .env.',
      );
    }

    const storeName = this.configService.get<string>('GEMINI_FILE_SEARCH_STORE_NAME');
    if (!storeName) {
      throw new ServiceUnavailableException(
        'La base de conocimiento de LideraBot no está configurada.',
      );
    }

    const client = new GoogleGenAI({ apiKey });
    const model = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash';
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: `${systemInstruction}\n\nFundamenta las respuestas en la información de File Search. Redacta de forma natural y fluida como un mentor personal. JAMÁS insertes citas de fuentes, títulos de documentos, ni aclaraciones bibliográficas entre paréntesis dentro del texto explicativo (evita frases como "(según se advierte en...)", "(fuente:...)", "(como señala...)"). Limítate a explicar el concepto pedagógico de forma natural; las fuentes se listarán automáticamente al final.`,
        tools: [{
          fileSearch: {
            fileSearchStoreNames: [storeName],
          },
        }],
      },
    });

    const sources = new Set<string>();
    const candidate = response.candidates?.[0] as any;
    const groundingMetadata = candidate?.groundingMetadata;
    if (groundingMetadata && Array.isArray(groundingMetadata.groundingChunks)) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.retrievedContext?.title) {
          sources.add(chunk.retrievedContext.title);
        } else if (chunk.web?.title) {
          sources.add(chunk.web.title);
        }
      }
    }

    return {
      text: (response.text || '').trim(),
      sources: [...sources],
    };
  }

  async evaluateActivityAttempt(
    activity: ActivityDefinition,
    studentResponse: string,
  ): Promise<ActivityEvaluation> {
    const rubric = activity.rubric
      .map((criterion) => `- ${criterion.criterion} (${criterion.weight}%): ${criterion.description}`)
      .join('\n');
    const prompt = `Evalúa la respuesta de un estudiante universitario a esta actividad usando únicamente las fuentes recuperadas y la rúbrica indicada.

Actividad: ${activity.title}
Habilidad: ${activity.skill}
Situación: ${activity.scenario}
Consigna: ${activity.instructions.join(' ')}
Rúbrica:
${rubric}

Respuesta del estudiante:
${studentResponse}

Devuelve solo JSON válido con este formato: {"score":0,"feedback":"retroalimentación concreta y respetuosa","strengths":["..."],"nextSteps":["..."],"rubricScores":[{"criterion":"...","score":0,"evidence":"...","suggestion":"..."}]}. score y rubricScores.score deben ser números entre 0 y 100. No inventes fuentes ni cites una fuente que no haya aparecido en el contexto recuperado.`;
    const response = await this.generateGroundedResponse(
      prompt,
      'Evalúas prácticas de liderazgo como mentor formativo. Usa criterios transparentes, no diagnostiques ni juzgues a la persona, y fundamenta conceptos en las fuentes recuperadas.',
    );
    const parsed = this.parseActivityEvaluation(response.text);

    if (!parsed) {
      return {
        score: null,
        feedback: response.text || 'Tu respuesta quedó guardada; el análisis automático está pendiente.',
        strengths: [],
        nextSteps: [],
        rubricScores: [],
        sources: response.sources.length ? response.sources : activity.sources,
        status: 'pending_evaluation',
      };
    }

    return {
      ...parsed,
      sources: response.sources.length ? response.sources : activity.sources,
      status: 'evaluated',
    };
  }

  private parseActivityEvaluation(rawText: string): Omit<ActivityEvaluation, 'sources' | 'status'> | null {
    const fencedJson = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    const candidate = fencedJson || (firstBrace >= 0 && lastBrace > firstBrace
      ? rawText.slice(firstBrace, lastBrace + 1)
      : rawText);

    try {
      const parsed = JSON.parse(candidate);
      if (typeof parsed.feedback !== 'string' || typeof parsed.score !== 'number') return null;
      const rubricScores = Array.isArray(parsed.rubricScores)
        ? parsed.rubricScores.flatMap((item: any) => {
          if (!item || typeof item.criterion !== 'string' || typeof item.score !== 'number') return [];
          return [{
            criterion: item.criterion,
            score: Math.max(0, Math.min(100, item.score)),
            evidence: typeof item.evidence === 'string' ? item.evidence : '',
            suggestion: typeof item.suggestion === 'string' ? item.suggestion : '',
          }];
        })
        : [];
      return {
        score: Math.max(0, Math.min(100, parsed.score)),
        feedback: parsed.feedback,
        strengths: Array.isArray(parsed.strengths)
          ? parsed.strengths.filter((item: unknown): item is string => typeof item === 'string')
          : [],
        nextSteps: Array.isArray(parsed.nextSteps)
          ? parsed.nextSteps.filter((item: unknown): item is string => typeof item === 'string')
          : [],
        rubricScores,
      };
    } catch {
      return null;
    }
  }

  private async getLocalKnowledgeFallback(message: string): Promise<string | null> {
    const knowledgePath = resolve(
      __dirname,
      '..',
      '..',
      'documents',
      'LideraBot',
      'base-conocimiento-liderazgo.md',
    );
    let knowledge: string;

    try {
      knowledge = await readFile(knowledgePath, 'utf8');
    } catch {
      return null;
    }

    const stopWords = new Set([
      'para', 'como', 'cómo', 'cual', 'cuál', 'cuales', 'cuáles', 'donde', 'dónde',
      'desde', 'entre', 'sobre', 'esta', 'este', 'estas', 'estos', 'tiene', 'tienen',
      'puede', 'pueden', 'quiero', 'necesito', 'ayuda', 'hacer', 'mejor', 'algo',
    ]);
    const normalize = (value: string) => value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const queryTerms = (normalize(message).match(/[a-z0-9]+/g) || [])
      .filter((term) => term.length > 3 && !stopWords.has(term));

    if (!queryTerms.length) return null;

    let section = '';
    const paragraphs = knowledge.split(/\r?\n\r?\n/).flatMap((block) => {
      const heading = block.match(/^#{1,6}\s+(.+)$/m);
      if (heading) {
        section = heading[1];
        return [];
      }
      if (section.toLowerCase().includes('fuentes citadas')) return [];
      const text = block.trim();
      if (!text || text.startsWith('#') || text.startsWith('- ')) return [];
      return [{ section, text }];
    });

    const matches = paragraphs
      .map((paragraph) => {
        const normalizedText = normalize(paragraph.text);
        const score = queryTerms.filter((term) => normalizedText.includes(term)).length;
        return { ...paragraph, score };
      })
      .filter((paragraph) => paragraph.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 2);

    if (!matches.length) return null;

    return matches
      .map(({ section: heading, text }) => `**${heading}**\n${text}`)
      .join('\n\n');
  }

  private async generateQuiz(message: string): Promise<GeneratedQuiz> {
    const systemInstruction = this.configService.get<string>('GEMINI_SYSTEM_INSTRUCTION') ||
      'Eres LideraBot. Genera únicamente JSON válido para actividades educativas. Devuelve un objeto con title, description, category, difficulty y una lista questions. Cada question tiene question, options (4 strings), correctIndex, explanation y points.';

    const prompt = `Genera una actividad educativa para desarrollo de liderazgo y habilidades profesionales. Necesito un cuestionario con 3 a 5 preguntas. La respuesta debe ser JSON válido con este formato exacto:
      {
        "title": "...",
        "description": "...",
        "category": "leadership",
        "difficulty": "beginner",
        "questions": [
          {
            "question": "...",
            "options": ["...","...","...","..."],
            "correctIndex": 0,
            "explanation": "...",
            "points": 10
          }
        ]
      }
      Basado en esta solicitud: ${message}`;

    const response = await this.generateGroundedResponse(prompt, systemInstruction);
    const quiz = this.parseQuizJson(response.text);

    if (!quiz) {
      throw new Error('La respuesta del modelo no fue un JSON válido para una actividad.');
    }

    return { ...quiz, sourceCitations: response.sources };
  }

  async streamReply(
    message: string,
    onChunk: (chunk: any) => void,
    context?: any,
    history: ChatHistoryEntry[] = [],
  ) {
    const trimmedMessage = message.trim();
    const contextSummary = context
      ? `Contexto del usuario: completó ${context.completedActivitiesCount ?? 0} actividades, su progreso general es ${context.progressPercent ?? 0}%, y su última actividad fue "${context.lastActivityTitle || 'sin actividad registrada'}". Habilidades registradas: ${JSON.stringify(context.skills || {})}. Promedios recientes por habilidad: ${JSON.stringify(context.skillScores || {})}. Últimos intentos y siguientes pasos: ${JSON.stringify(context.recentActivityAttempts || [])}.`
      : '';

    if (this.isGreeting(trimmedMessage)) {
      onChunk({
        type: 'text',
        payload:
          '¡Hola! Soy LideraBot. Estoy aquí para ayudarte con liderazgo, comunicación, toma de decisiones y ejercicios prácticos. ¿En qué te puedo apoyar?',
      });
      return;
    }

    const wantsProgressFeedback = /(progreso|avance|retroalimentaci[oó]n|qué hice|actividad que hice|qué actividad (hice|completé|realicé|terminé)|mi progreso|cuánto he avanzado|cómo voy)/i.test(trimmedMessage);
    if (wantsProgressFeedback && contextSummary) {
      const lastTitle = context.lastActivityTitle ? `Tu última actividad fue "${context.lastActivityTitle}".` : 'Todavía no has registrado una actividad reciente.';
      onChunk({
        type: 'text',
        payload: `He visto que llevas ${context.completedActivitiesCount ?? 0} actividades completadas y tu progreso general es ${context.progressPercent ?? 0}%. ${lastTitle} Te recomiendo seguir con una actividad que fortalezca tu área más débil y mantener el ritmo de práctica.`,
      });
      return;
    }

    if (this.isUnsupportedRequest(trimmedMessage)) {
      onChunk({
        type: 'text',
        payload:
          'Puedo ayudarte con ideas, ejercicios y orientación de liderazgo, pero no puedo generar imágenes desde este chat actual. Si quieres, puedo describirte una imagen o ayudarte a crear un prompt para otra herramienta.',
      });
      return;
    }

    const systemInstruction = this.configService.get<string>('GEMINI_SYSTEM_INSTRUCTION') ||
      'Eres LideraBot, un mentor virtual en español especializado en desarrollo de liderazgo. Responde de forma clara, práctica y motivadora. No inventes datos académicos del estudiante.';
    const recentConversation = history.slice(-8)
      .map((entry) => `${entry.role === 'assistant' ? 'LideraBot' : 'Estudiante'}: ${entry.content}`)
      .join('\n');
    const activityOptions = ACTIVITY_CATALOG.map((activity) =>
      `- "${activity.title}" (${activity.skill}, ${activity.difficulty})`,
    ).join('\n');

    try {
      const prompt = [
        contextSummary,
        recentConversation ? `Conversación reciente:\n${recentConversation}` : '',
        `Mensaje actual del estudiante: ${trimmedMessage}`,
        `Actividades preestablecidas disponibles:\n${activityOptions}`,
      ].filter(Boolean).join('\n\n');
      const mentorInstruction = `${systemInstruction}\n\nUsa la conversación reciente y el progreso para entender qué habilidad necesita practicar. Recomienda únicamente las actividades preestablecidas del catálogo usando sus títulos exactos entre comillas (por ejemplo "El liderazgo que necesita el equipo") y explica por qué encaja. No intentes crear ni ofrecer cuestionarios o quizzes dinámicos; únicamente orienta al usuario hacia una de las 6 actividades preestablecidas disponibles. JAMÁS incluyas identificadores internos, slugs, claves técnicas ni títulos/citas de fuentes entre paréntesis dentro del texto principal (como "(situational-leadership)" o "(según se advierte en...)"). No digas frases como "respaldado por la fuente" ni "según la fuente", habla con naturalidad y fluidez. No digas que una actividad está completada hasta ver ese dato en el progreso.`;
      const result = await this.generateGroundedResponse(prompt, mentorInstruction);
      if (!result.text) throw new Error('Gemini devolvió una respuesta vacía.');

      const citations = result.sources.length
        ? `\n\nReferencia: ${result.sources.join('; ')}`
        : '';
      onChunk({ type: 'text', payload: `${result.text}${citations}` });
    } catch (error) {
      console.error('[Chat] Error al consultar Gemini:', error);
      const localAnswer = await this.getLocalKnowledgeFallback(trimmedMessage);
      const apiError = error as { status?: number; statusCode?: number; error?: { code?: string } };
      const rateLimited = apiError.status === 429
        || apiError.statusCode === 429
        || apiError.error?.code === 'too_many_requests';
      const notice = rateLimited
        ? 'Gemini alcanzó el límite diario de solicitudes. Mientras se restablece, esta respuesta se recuperó de la base local:'
        : 'Gemini no está disponible. Esta respuesta se recuperó de la base local:';
      const fallbackMessage = localAnswer
        ? `${notice}\n\n${localAnswer}`
        : 'No pude consultar Gemini y no encontré una respuesta pertinente en la base local. Inténtalo de nuevo más tarde.';
      onChunk({ type: 'text', payload: fallbackMessage });
    }
  }
}
