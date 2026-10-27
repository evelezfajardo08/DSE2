import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Send,
  User,
  PlusCircle,
  Sparkles,
  ClipboardCheck,
  LockKeyhole,
  Unlock,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { leadershipModules } from '../leadershipData';
import { DiagnosticEvaluationResult } from '../diagnosticData';

interface ChatPanelProps {
  userId: number;
  userEmail?: string;
  userName?: string;
  completedActivityIds: string[];
  totalAvailableActivities: number;
  moduleAnswers?: Record<string, string>;
  diagnosticResult?: DiagnosticEvaluationResult | null;
  hasInteractedWithBot?: boolean;
  unlockedSubmoduleIds?: number[];
  initialPrompt?: string | null;
  onPromptHandled?: () => void;
  onBotInteraction?: () => void;
  onOpenDiagnostic?: () => void;
  onOpenSubmodule?: (moduleId: number, level?: number) => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const getInitialGreeting = (userName?: string, hasDiagnostic?: boolean): Message[] => [
  {
    id: '1',
    type: 'bot',
    content: hasDiagnostic
      ? `¡Hola${userName ? `, **${userName}**` : ''}! Soy **LideraBot**, tu chatbot y mentor en la plataforma. Ya realizaste tu Prueba Diagnóstica Inicial, por lo que tu módulo recomendado está desbloqueado. Recuerda que a medida que completes satisfactoriamente cada módulo (5 de 5 niveles), irás escalonando y desbloqueando el siguiente. ¿En qué te puedo ayudar hoy?`
      : `¡Hola${userName ? `, **${userName}**` : ''}! 👋 Soy **LideraBot**, el chatbot que te acompañará en todo tu recorrido por esta aplicación.\n\nPara iniciar nuestro proceso de interacción, primero debes realizar una **Prueba Diagnóstica Inicial**. Con base en tus resultados identificaré tus habilidades, fortalezas y debilidades, te diré **qué módulo te recomiendo estudiar primero** y cómo irás **escalonando paso a paso para desbloquear los demás módulos** cuando termines los primeros satisfactoriamente.\n\nEscríbeme **"Hola"** para interactuar conmigo y **desbloquear tu Prueba Diagnóstica**.`,
    timestamp: new Date(),
  },
];

const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:4001');

function cleanBotMarkdown(text: string): string {
  return text
    .replace(/\[ABRIR_SUBMODULO:\s*\d+\s*\]/gi, '')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\textbf\{([^}]*)\}/g, '**$1**')
    .replace(/\\textit\{([^}]*)\}/g, '*$1*')
    .replace(/\\rightarrow|\\to|\\longrightarrow|\\Rightarrow/g, '→')
    .replace(/\\leftarrow|\\longleftarrow/g, '←')
    .replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, '**$1**')
    .replace(/\$\s*([^$\n]+?)\s*\$/g, '$1')
    .trim();
}

function extractSubmoduleAction(text: string): number | null {
  const match = text.match(/\[ABRIR_SUBMODULO:\s*([1-5])\s*\]/i);
  if (!match) return null;
  return Number(match[1]);
}

export function ChatPanel({
  userEmail = 'guest',
  userName,
  completedActivityIds,
  totalAvailableActivities,
  moduleAnswers = {},
  diagnosticResult = null,
  hasInteractedWithBot = false,
  unlockedSubmoduleIds = [],
  initialPrompt = null,
  onPromptHandled,
  onBotInteraction,
  onOpenDiagnostic,
  onOpenSubmodule,
}: ChatPanelProps) {
  const storageKey = `liderabot-chat-messages-v3:${userEmail}`;

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const storedMessages = localStorage.getItem(storageKey);
      if (!storedMessages) return getInitialGreeting(userName, Boolean(diagnosticResult));
      const parsedMessages = JSON.parse(storedMessages) as Message[];
      if (!Array.isArray(parsedMessages) || parsedMessages.length === 0) {
        return getInitialGreeting(userName, Boolean(diagnosticResult));
      }
      return parsedMessages.map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    } catch {
      return getInitialGreeting(userName, Boolean(diagnosticResult));
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewConversation = () => {
    localStorage.removeItem(storageKey);
    setMessages(getInitialGreeting(userName, Boolean(diagnosticResult)));
  };

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore storage errors
    }
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt && !isTyping) {
      void sendPromptText(initialPrompt);
      onPromptHandled?.();
    }
  }, [initialPrompt]);

  const appendUniqueMessage = (message: Message) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (
        lastMessage &&
        lastMessage.type === message.type &&
        lastMessage.content.trim() === message.content.trim()
      ) {
        return prev;
      }
      return [...prev, message];
    });
  };

  const buildModuleProgressSummary = () => {
    const lines: string[] = [];
    for (const mod of leadershipModules) {
      const isUnlocked = unlockedSubmoduleIds.includes(mod.id);
      const topicDetails: string[] = [];
      for (const topic of mod.topics) {
        const key = `${mod.id}-${topic.level}`;
        const rawAns = moduleAnswers[key];
        if (topic.level < 5) {
          topicDetails.push(
            `  - Contenido ${topic.level} (${topic.topicTitle} - ${topic.authorCitation}): ${rawAns && rawAns.trim() ? 'Contenido estudiado' : 'Pendiente por estudiar'}`,
          );
        } else if (rawAns && rawAns.trim()) {
          const cleanAns = rawAns.replace('|||', ' | Sustentación: ');
          topicDetails.push(
            `  - Ejercicio Práctico Final (${topic.topicTitle} - ${topic.authorCitation}): Estudiante respondió: "${cleanAns}"`,
          );
        } else {
          topicDetails.push(
            `  - Ejercicio Práctico Final (${topic.topicTitle}): Pendiente por responder`,
          );
        }
      }
      lines.push(
        `Submódulo ${mod.id}: ${mod.name} (${mod.authorsSummary}) [${isUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO HASTA COMPLETAR EL ANTERIOR'}]\n${topicDetails.join('\n')}`,
      );
    }
    return lines.join('\n\n');
  };

  const buildDiagnosticSummary = () => {
    if (!diagnosticResult) {
      return 'El estudiante todavía no ha realizado la Prueba Diagnóstica Inicial de 14 preguntas. Los módulos están bloqueados hasta que realice la prueba diagnóstica.';
    }

    const orderIds = diagnosticResult.recommendedSubmoduleOrder || [1, 2, 3, 4, 5];
    const startId = diagnosticResult.recommendedStartingSubmoduleId || orderIds[0] || 1;
    const startMod = leadershipModules.find((m) => m.id === startId) || leadershipModules[0];

    const modLines = diagnosticResult.competencyModules
      .map(
        (m) =>
          `- ${m.moduleTitle} (${m.competency}): ${m.levelTitle} (${m.percentage}%) -> Recomendación: ${m.studyStatus}. Fortalezas: ${m.strengths}. Debilidades/Reforzar: ${m.weaknesses}. Temas a reforzar: ${m.reinforcementTopics.join(', ')}.`,
      )
      .join('\n');

    const subLines = diagnosticResult.submoduleRecommendations
      .map((s) => `- ${s.moduleName}: ${s.priority} (${s.reason})`)
      .join('\n');

    return [
      `Nivel General Obtenido: ${diagnosticResult.overallLevelTitle} (${diagnosticResult.overallPercentage}%)`,
      `Primer Submódulo Recomendado y Desbloqueado: Submódulo ${startMod.id} (${startMod.name})`,
      `Orden de Escalonamiento de Submódulos (se desbloquean uno a uno al completar 5/5 niveles del anterior): ${orderIds.map((id) => `Submódulo 0${id}`).join(' → ')}`,
      `Submódulos actualmente desbloqueados para el estudiante: ${unlockedSubmoduleIds.map((id) => `Submódulo 0${id}`).join(', ')}`,
      `Habilidades detectadas: ${diagnosticResult.skillsProfile.join('; ')}`,
      `Fortalezas principales: ${diagnosticResult.strengthsList.join(' | ')}`,
      `Debilidades / Áreas de mejora: ${diagnosticResult.weaknessesList.join(' | ')}`,
      `Diagnóstico por Módulos Generales (1. Liderazgo, 2. Comunicación, 3. Toma de Decisiones, 4. Trabajo en Equipo):\n${modLines}`,
      `Ruta en los 5 Submódulos de Liderazgo:\n${subLines}`,
    ].join('\n\n');
  };

  const buildUserContext = () => {
    const totalAvailable = Math.max(totalAvailableActivities, 1);
    const completedCount = completedActivityIds.length;
    const progressPercent = Math.min(100, Math.round((completedCount / totalAvailable) * 100));

    return {
      completedActivitiesCount: completedCount,
      progressPercent,
      hasCompletedDiagnostic: Boolean(diagnosticResult),
      moduleProgressSummary: buildModuleProgressSummary(),
      diagnosticSummary: buildDiagnosticSummary(),
    };
  };

  const sendPromptText = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Unlock diagnostic test upon first interaction with the chatbot
    onBotInteraction?.();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    appendUniqueMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          context: buildUserContext(),
          history: messages.slice(-8).map((message) => ({
            role: message.type === 'bot' ? 'assistant' : 'user',
            content: message.content.slice(0, 1500),
          })),
        }),
      });
      if (!response.ok || !response.body) {
        throw new Error('No se pudo conectar con LideraBot.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamedReply = '';
      const botMessageId = (Date.now() + 1).toString();
      let botMessageCreated = false;

      const updateBotMessage = (content: string) => {
        setMessages((prev) =>
          prev.map((message) => {
            if (message.id !== botMessageId) return message;
            if (message.content === content) return message;
            return { ...message, content };
          }),
        );
      };

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          const dataLine = event.split('\n').find((line) => line.startsWith('data: '));
          if (!dataLine) continue;

          let eventData: any = null;
          try {
            eventData = JSON.parse(dataLine.slice(6));
          } catch {
            eventData = dataLine.slice(6);
          }

          if (typeof eventData === 'string') {
            try {
              eventData = JSON.parse(eventData);
            } catch {
              // keep raw text fallback
            }
          }

          if (event.startsWith('event: error')) throw new Error(String(eventData));
          if (event.startsWith('event: done')) continue;

          const messageText =
            eventData && typeof eventData === 'object' && 'payload' in eventData
              ? String(eventData.payload ?? '')
              : typeof eventData === 'string'
                ? eventData
                : '';

          if (!botMessageCreated) {
            botMessageCreated = true;
            appendUniqueMessage({
              id: botMessageId,
              type: 'bot',
              content: '',
              timestamp: new Date(),
            });
          }
          streamedReply += messageText;
          updateBotMessage(streamedReply);
        }

        if (done) break;
      }

      if (!streamedReply) throw new Error('No se recibió respuesta de LideraBot.');
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Error de conexión con LideraBot. Verifica que el servidor backend esté activo.',
        timestamp: new Date(),
      };
      appendUniqueMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    void sendPromptText(inputValue);
  };

  const recommendedStartId =
    diagnosticResult?.recommendedStartingSubmoduleId ?? unlockedSubmoduleIds[0] ?? 1;
  const recommendedStartModule =
    leadershipModules.find((m) => m.id === recommendedStartId) ?? leadershipModules[0];

  return (
    <Card className="flex flex-col h-full w-full shadow-lg border-[#DCE3EF] overflow-hidden rounded-[22px]">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b bg-[#0F3B8F] text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FACC15] text-[#0F3B8F] rounded-xl flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-white font-extrabold tracking-tight text-sm sm:text-base">
            LideraBot · Asistente y Guía de Aprendizaje
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewConversation}
            className="text-white hover:bg-white/20 hover:text-white text-xs gap-1.5 px-2.5 py-1.5 border border-white/30 rounded-lg transition-colors"
            title="Reiniciar conversación"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Reiniciar</span>
          </Button>
        </div>
      </div>

      {/* Messages Area - Takes remaining height with internal scroll */}
      <ScrollArea className="min-h-0 flex-1 overflow-y-auto bg-[#F8FAFD]">
        <div className="space-y-4 p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'bot'
                    ? 'bg-[#0F3B8F] text-white'
                    : 'bg-[#A855F7] text-white'
                }`}
              >
                {message.type === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div
                className={`min-w-0 max-w-[82%] overflow-hidden rounded-2xl px-4 py-3 ${
                  message.type === 'bot'
                    ? 'bg-white border border-[#DCE3EF] shadow-sm text-[#152542]'
                    : 'bg-[#0F3B8F] text-white'
                }`}
              >
                {message.type === 'bot' ? (
                  <div className="min-w-0 break-words text-sm leading-6 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:font-bold [&_ol]:my-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:my-2 [&_ul]:ml-5 [&_ul]:list-disc">
                    {(() => {
                      const actionModId = extractSubmoduleAction(message.content);
                      const targetMod =
                        actionModId !== null
                          ? (leadershipModules.find((m) => m.id === actionModId) ??
                            recommendedStartModule)
                          : null;
                      const cleanedContent = cleanBotMarkdown(message.content);
                      const refIndex = cleanedContent.search(
                        /\n\n(Referencia|Fuentes consultadas):/i,
                      );
                      return (
                        <>
                          {refIndex !== -1 ? (
                            <>
                              <ReactMarkdown>{cleanedContent.slice(0, refIndex)}</ReactMarkdown>
                              <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-muted-foreground italic">
                                <ReactMarkdown>
                                  {cleanedContent.slice(refIndex).trim()}
                                </ReactMarkdown>
                              </div>
                            </>
                          ) : (
                            <ReactMarkdown>{cleanedContent}</ReactMarkdown>
                          )}

                          {targetMod && diagnosticResult && onOpenSubmodule && (
                            <div className="mt-3 pt-3 border-t border-[#E4EAF3] flex items-center justify-between gap-3">
                              <span className="text-xs font-bold text-[#0E785F]">
                                Submódulo 0{targetMod.id}: {targetMod.name}
                              </span>
                              <button
                                onClick={() => onOpenSubmodule(targetMod.id, 1)}
                                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#0E785F] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#0B614D]"
                              >
                                Abrir Submódulo 0{targetMod.id} <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="break-words text-sm">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Action Banner inside chat once user has interacted (before diagnostic) */}
          {hasInteractedWithBot && !diagnosticResult && onOpenDiagnostic && (
            <div className="rounded-2xl border-2 border-[#FACC15] bg-[#FFFBEB] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#92400E]">
                  ✓ ¡Prueba Diagnóstica Desbloqueada!
                </p>
                <p className="text-sm font-bold text-[#10264F] mt-0.5">
                  Completa las 14 preguntas para que LideraBot te recomiende y desbloquee tu primer
                  módulo.
                </p>
              </div>
              <button
                onClick={onOpenDiagnostic}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#0F3B8F] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#174AA6]"
              >
                Ir a la Prueba Diagnóstica <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#0F3B8F] text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="rounded-2xl border border-[#DCE3EF] bg-white px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-[#2D6BFF] rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-[#2D6BFF] rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-[#2D6BFF] rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Bar */}
      <div className="p-3.5 border-t border-[#DCE3EF] bg-white shrink-0">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              !hasInteractedWithBot
                ? 'Escribe "Hola" para iniciar y desbloquear tu Prueba Diagnóstica...'
                : 'Escribe tu mensaje a LideraBot...'
            }
            className="flex-1 rounded-xl border-[#C9D2E1]"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
            className="flex-shrink-0 bg-[#0F3B8F] hover:bg-[#174AA6] rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
