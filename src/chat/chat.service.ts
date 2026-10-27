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

interface GeneratedQuiz {
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

  private sanitizePlainMarkdown(text: string): string {
    return text
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\textbf\{([^}]*)\}/g, '**$1**')
      .replace(/\\textit\{([^}]*)\}/g, '*$1*')
      .replace(/\\rightarrow|\\to|\\longrightarrow|\\Rightarrow/g, '→')
      .replace(/\\leftarrow|\\longleftarrow/g, '←')
      .replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, '**$1**')
      .replace(/\$\s*([^$\n]+?)\s*\$/g, '$1')
      .trim();
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
    const client = new GoogleGenAI({ apiKey });
    const model = this.configService.get<string>('GEMINI_MODEL') || 'gemini-3.5-flash-lite';

    const baseInstruction = `${systemInstruction}\n\nFundamenta las respuestas en el marco teórico de los módulos de liderazgo, comunicación, toma de decisiones y trabajo en equipo. Redacta de forma natural y fluida como un mentor personal. PROHIBIDO usar sintaxis LaTeX o fórmulas matemáticas (no uses $$, $, \\text{}, \\rightarrow ni bloques matemáticos); usa texto normal con flechas Unicode simples (→) y formato Markdown estándar.`;

    let response: any;

    if (storeName) {
      try {
        response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: baseInstruction,
            tools: [
              {
                fileSearch: {
                  fileSearchStoreNames: [storeName],
                },
              },
            ],
          },
        });
      } catch (err: any) {
        console.warn(
          '[Chat] FileSearch no disponible o falló, reintentando consulta directa:',
          err?.message,
        );
      }
    }

    if (!response) {
      response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: baseInstruction,
        },
      });
    }

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
      text: this.sanitizePlainMarkdown(response.text || ''),
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

    const moduleProgressBlock = context?.moduleProgressSummary
      ? `Avance en los Módulos y Respuestas registradas por el estudiante:\n${context.moduleProgressSummary}`
      : '';
    const diagnosticBlock = context?.diagnosticSummary
      ? `Resultado de la Prueba Diagnóstica Inicial del estudiante:\n${context.diagnosticSummary}`
      : 'El estudiante aún no ha completado la Prueba Diagnóstica Inicial de 14 preguntas.';

    const contextSummary = context
      ? [
          `Contexto general del estudiante: completó ${context.completedActivitiesCount ?? 0} niveles/actividades, progreso general en el Módulo 1 de Liderazgo: ${context.progressPercent ?? 0}%.`,
          diagnosticBlock,
          moduleProgressBlock,
        ]
          .filter(Boolean)
          .join('\n\n')
      : '';

    if (this.isGreeting(trimmedMessage)) {
      const hasDiagnostic = Boolean(context?.hasCompletedDiagnostic);
      if (!hasDiagnostic) {
        onChunk({
          type: 'text',
          payload:
            '¡Hola! Soy **LideraBot**, tu chatbot y guía en esta plataforma. ¡Bienvenido! Para iniciar nuestro proceso de interacción en la aplicación, lo primero que haremos es realizar una **Prueba Diagnóstica Inicial**. Con tus resultados te diré cuáles son tus fortalezas y debilidades, qué módulo te recomiendo estudiar primero y cómo iremos escalonando paso a paso para desbloquear los demás módulos a medida que los termines satisfactoriamente.\n\n¡Acabo de desbloquear tu **Prueba Diagnóstica**! Haz clic en el botón **"Iniciar Prueba Diagnóstica"** aquí abajo para comenzar.',
        });
        return;
      }

      onChunk({
        type: 'text',
        payload:
          '¡Hola de nuevo! Soy **LideraBot**. Ya completaste tu Prueba Diagnóstica Inicial, así que podemos revisar el módulo que tienes desbloqueado actualmente, analizar tus respuestas o ver cómo vas escalonando hacia el siguiente módulo. ¿En qué te ayudo hoy?',
      });
      return;
    }

    if (this.isUnsupportedRequest(trimmedMessage)) {
      onChunk({
        type: 'text',
        payload:
          'Puedo ayudarte con retroalimentación de tus respuestas en los módulos, análisis de tu prueba diagnóstica y orientación en liderazgo, comunicación, toma de decisiones y trabajo en equipo, pero no genero imágenes.',
      });
      return;
    }

    const systemInstruction = this.configService.get<string>('GEMINI_SYSTEM_INSTRUCTION') ||
      'Eres LideraBot, un mentor virtual universitario en español especializado en Liderazgo, Comunicación, Toma de Decisiones y Trabajo en Equipo. Responde con rigor académico, calidez y sentido práctico.';
    const recentConversation = history.slice(-8)
      .map((entry) => `${entry.role === 'assistant' ? 'LideraBot' : 'Estudiante'}: ${entry.content}`)
      .join('\n');

    try {
      const prompt = [
        contextSummary,
        recentConversation ? `Conversación reciente:\n${recentConversation}` : '',
        `Mensaje actual del estudiante: ${trimmedMessage}`,
      ].filter(Boolean).join('\n\n');

      const mentorInstruction = `${systemInstruction}

INSTRUCCIONES CLAVE DE RETROALIMENTACIÓN Y DIAGNÓSTICO:
1. Tienes acceso completo a las respuestas que el estudiante ha escrito o seleccionado en los submódulos y en la Prueba Diagnóstica Inicial (14 preguntas sobre Comunicación, Liderazgo, Toma de Decisiones y Trabajo en Equipo).
2. Cuando el estudiante pida retroalimentación de sus respuestas o módulos, analiza específicamente lo que respondió comparándolo con la base de datos documental y los autores fundamentales:
   - Submódulo 1 (Liderazgo Transformacional): James MacGregor Burns (1978) y Bernard M. Bass (1985 - las 4 I's: Influencia Idealizada, Motivación Inspiradora, Estimulación Intelectual, Consideración Individualizada).
   - Submódulo 2 (Liderazgo Participativo / Democrático): Kurt Lewin, Lippitt y White (1939) y Daniel Goleman et al. (2000/2002).
   - Submódulo 3 (Liderazgo estilo Coaching): Daniel Goleman, Boyatzis y McKee (2000/2002).
   - Submódulo 4 (Liderazgo Delegativo / Laissez-Faire): Kurt Lewin, Lippitt y White (1939).
   - Submódulo 5 (Liderazgo Situacional / Adaptativo): Paul Hersey y Kenneth Blanchard (1969 - niveles de madurez M1 a M4 y estilos E1 a E4).
   - Además de los marcos de Comunicación Efectiva/Asertiva, Toma de Decisiones (Vroom-Yetton, racionalidad limitada, sesgos cognitivos) y Trabajo en Equipo (etapas de Tuckman y las 5 C).
3. Cuando consulte sobre su Prueba Diagnóstica o ruta de estudio, indícale claramente:
   - Qué Módulos Generales (1. Liderazgo, 2. Comunicación, 3. Toma de Decisiones, 4. Trabajo en Equipo) y qué Submódulos debe estudiar con prioridad y cuáles ya domina o no necesita cursar a fondo.
   - En qué temas específicos debe reforzar.
   - Cuáles son sus habilidades actuales, fortalezas y debilidades detectadas.
4. Habla con naturalidad como un mentor académico cercano y riguroso.
5. BOTÓN PARA ABRIR SUBMÓDULO: Tienes la capacidad de mostrarle al estudiante un botón interactivo para abrir un submódulo escribiendo al final de tu respuesta la etiqueta exacta [ABRIR_SUBMODULO:X] (donde X es el número del submódulo desbloqueado del 1 al 5, por ejemplo [ABRIR_SUBMODULO:1]). Incluye esta etiqueta ÚNICAMENTE cuando decidas que es el momento oportuno y necesario para que el estudiante entre al submódulo (por ejemplo, cuando el estudiante confirme que está listo para comenzar, pida abrir/iniciar el submódulo o cuando lo envíes directamente a resolver las actividades del submódulo). NO incluyas la etiqueta si apenas estás conversando, explicando conceptos o preguntándole si está listo.`;

      const result = await this.generateGroundedResponse(prompt, mentorInstruction);
      if (!result.text) throw new Error('Gemini devolvió una respuesta vacía.');

      const citations = result.sources.length
        ? `\n\nReferencia: ${result.sources.join('; ')}`
        : '';
      onChunk({ type: 'text', payload: `${result.text}${citations}` });
    } catch (error) {
      console.error('[Chat] Error al consultar Gemini:', error);
      const localAnswer = await this.getLocalKnowledgeFallback(trimmedMessage);
      const contextualFallback = [
        context?.diagnosticSummary
          ? `**Resumen de tu Diagnóstico y Ruta:**\n${context.diagnosticSummary}`
          : '',
        context?.moduleProgressSummary
          ? `**Estado de tus respuestas en los Submódulos:**\n${context.moduleProgressSummary}`
          : '',
        localAnswer ? `**Base de Conocimiento de LideraBot:**\n${localAnswer}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const fallbackMessage = contextualFallback
        ? `Aquí tienes la retroalimentación basada en tu registro y en la base de conocimiento local de LideraBot:\n\n${contextualFallback}`
        : 'En este momento el servicio de IA externo tiene alta demanda. Revisa tus respuestas registradas en los submódulos o completa la Prueba Diagnóstica para obtener tu análisis detallado.';
      onChunk({ type: 'text', payload: fallbackMessage });
    }
  }
}
