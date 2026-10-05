import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, Send, Mic, User, PlusCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface ChatPanelProps {
  userId: number;
  userEmail?: string;
  completedActivityIds: string[];
  totalAvailableActivities: number;
  onOpenActivitiesWithQuiz?: (quiz: any) => void;
  onOpenRecommendedActivity?: (activityId: string) => void;
}

interface ActivityOption {
  id: string;
  title: string;
}

interface ActivityAttemptContext {
  activity_id: string;
  activity_title: string;
  skill: string;
  score: number | null;
  next_steps: string[];
  status: 'evaluated' | 'pending_evaluation';
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  recommendedActivityId?: string;
  recommendedActivityTitle?: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: '¡Hola! Soy LideraBot, tu asistente virtual para desarrollar habilidades de liderazgo. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date(),
  },
];

const suggestedQuestions = [
  '¿Cómo puedo mejorar mi comunicación?',
  'Ejercicios de toma de decisiones',
  'Retroalimentación de mi progreso',
  '¿Qué estrategias me ayudan a liderar mejor?',
];

export function ChatPanel({ userId, userEmail = 'guest', completedActivityIds, totalAvailableActivities, onOpenActivitiesWithQuiz, onOpenRecommendedActivity }: ChatPanelProps) {
  const storageKey = `liderabot-chat-messages:${userEmail}`;

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const storedMessages = localStorage.getItem(storageKey);
      if (!storedMessages) return initialMessages;
      const parsedMessages = JSON.parse(storedMessages) as Message[];
      if (!Array.isArray(parsedMessages) || parsedMessages.length === 0) return initialMessages;
      return parsedMessages.map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    } catch {
      return initialMessages;
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activityAttempts, setActivityAttempts] = useState<ActivityAttemptContext[]>([]);
  const [activityOptions, setActivityOptions] = useState<ActivityOption[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewConversation = () => {
    localStorage.removeItem(storageKey);
    setMessages(initialMessages);
  };

  useEffect(() => {
    let isActive = true;
    fetch('http://localhost:4001/activities')
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        if (isActive) setActivityOptions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isActive) setActivityOptions([]);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const token = localStorage.getItem('access_token') || '';

    fetch('http://localhost:4001/activities/attempts/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        if (isActive) setActivityAttempts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isActive) setActivityAttempts([]);
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

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

  const buildUserContext = () => {
    try {
      const completedActivities = JSON.parse(localStorage.getItem(`completed-activities:${userEmail}`) || '[]');
      const completedGenerated = JSON.parse(localStorage.getItem(`completed-generated-quizzes:${userEmail}`) || '[]');
      const skillMap = JSON.parse(localStorage.getItem(`completed-activity-skills:${userEmail}`) || '{}');
      const totalAvailable = Math.max(totalAvailableActivities, 1);
      const storedActivityIds = Array.isArray(completedActivities) ? completedActivities : [];
      const history = Array.isArray(completedGenerated) ? completedGenerated : [];
      const completedAttemptTitles = activityAttempts
        .filter((attempt) => attempt.status === 'evaluated')
        .map((attempt) => attempt.activity_id);
      const completedActivitiesCount = new Set([
        ...storedActivityIds,
        ...completedActivityIds,
        ...completedAttemptTitles,
      ]).size;
      const latestAttempt = activityAttempts[0];
      const lastActivityTitle = latestAttempt?.activity_title || history[0]?.title || null;
      const lastCategory = latestAttempt?.skill || history[0]?.category || null;
      const progressPercent = Math.min(100, Math.round((completedActivitiesCount / totalAvailable) * 100));
      const groupedScores = activityAttempts.reduce<Record<string, number[]>>((scores, attempt) => {
        if (attempt.score !== null && attempt.status === 'evaluated') {
          (scores[attempt.skill] ??= []).push(attempt.score);
        }
        return scores;
      }, {});
      const skillScores = Object.fromEntries(Object.entries(groupedScores).map(([skill, scores]) => [
        skill,
        Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      ]));

      return {
        completedActivitiesCount: Math.max(activitiesCount, completedActivitiesCount),
        progressPercent,
        lastActivityTitle,
        lastCategory,
        skills: skillMap && typeof skillMap === 'object' ? skillMap : {},
        skillScores,
        recentActivityAttempts: activityAttempts.slice(0, 3).map((attempt) => ({
          title: attempt.activity_title,
          skill: attempt.skill,
          score: attempt.score,
          nextSteps: attempt.next_steps,
        })),
      };
    } catch {
      return {
        completedActivitiesCount: 0,
        progressPercent: 0,
        lastActivityTitle: null,
        lastCategory: null,
        skills: {},
      };
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    appendUniqueMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:4001/chat', {
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
        setMessages((prev) => prev.map((message) => {
          if (message.id !== botMessageId) return message;
          if (message.content === content) return message;
          return { ...message, content };
        }));
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

          if (
            eventData &&
            typeof eventData === 'object' &&
            (eventData.type === 'quiz' || eventData.type === 'activity')
          ) {
            onOpenActivitiesWithQuiz?.(eventData.payload);
            continue;
          }

          const messageText = eventData && typeof eventData === 'object' && 'payload' in eventData
            ? String(eventData.payload ?? '')
            : typeof eventData === 'string'
              ? eventData
              : '';

          if (!botMessageCreated) {
            botMessageCreated = true;
            appendUniqueMessage({ id: botMessageId, type: 'bot', content: '', timestamp: new Date() });
          }
          streamedReply += messageText;
          updateBotMessage(streamedReply);
        }

        if (done) break;
      }

      if (!streamedReply) throw new Error('No se recibió respuesta de LideraBot.');
      const recommendation = activityOptions.find((activity) => streamedReply.includes(activity.title));
      if (recommendation) {
        setMessages((previous) => previous.map((message) => message.id === botMessageId
          ? {
            ...message,
            recommendedActivityId: recommendation.id,
            recommendedActivityTitle: recommendation.title,
          }
          : message));
      }
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Error de conexión con LideraBot.',
        timestamp: new Date(),
      };
      appendUniqueMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <Card className="flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary/90 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-medium">LideraBot</h3>
            <p className="text-xs text-white/80">En línea</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewConversation}
          className="text-white hover:bg-white/20 hover:text-white text-xs gap-1.5 px-3 py-1.5 border border-white/30 rounded-md transition-colors"
          title="Eliminar conversación y empezar de nuevo"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva conversación</span>
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'bot' ? 'bg-primary text-white' : 'bg-secondary text-foreground'
              }`}>
                {message.type === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`min-w-0 max-w-[75%] overflow-hidden rounded-2xl px-4 py-2 ${
                message.type === 'bot' ? 'bg-white border shadow-sm' : 'bg-primary text-white'
              }`}>
                {message.type === 'bot' ? (
                  <div className="min-w-0 break-words text-sm leading-6 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:font-semibold [&_ol]:my-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:ml-5 [&_ul]:list-disc">
                    {(() => {
                      const refIndex = message.content.search(/\n\n(Referencia|Fuentes consultadas):/i);
                      if (refIndex !== -1) {
                        const mainText = message.content.slice(0, refIndex);
                        const refText = message.content.slice(refIndex).trim();
                        return (
                          <>
                            <ReactMarkdown>{mainText}</ReactMarkdown>
                            <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-muted-foreground italic">
                              <ReactMarkdown>{refText}</ReactMarkdown>
                            </div>
                          </>
                        );
                      }
                      return <ReactMarkdown>{message.content}</ReactMarkdown>;
                    })()}
                    {message.recommendedActivityId && message.recommendedActivityTitle && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3"
                        onClick={() => onOpenRecommendedActivity?.(message.recommendedActivityId!)}
                      >
                        Abrir {message.recommendedActivityTitle}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="break-words text-sm">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-sm text-muted-foreground mb-2">Preguntas sugeridas:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
          />
          <Button size="icon" variant="outline" className="flex-shrink-0">
            <Mic className="w-5 h-5" />
          </Button>
          <Button size="icon" onClick={handleSend} className="flex-shrink-0 bg-primary hover:bg-primary/90">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
