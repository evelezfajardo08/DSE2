import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Mic, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: '¡Hola! Soy LideraBot, tu asistente virtual para desarrollar habilidades de liderazgo. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date(),
  }
];

const suggestedQuestions = [
  '¿Cómo puedo mejorar mi comunicación?',
  'Ejercicios de toma de decisiones',
  'Tips de liderazgo',
  'Retroalimentación de mi progreso'
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:4001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
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
        setMessages((prev) => prev.map((message) => (
          message.id === botMessageId ? { ...message, content } : message
        )));
      };

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          const dataLine = event.split('\n').find((line) => line.startsWith('data: '));
          if (!dataLine) continue;
          const eventData = JSON.parse(dataLine.slice(6));
          if (event.startsWith('event: error')) throw new Error(eventData);
          if (event.startsWith('event: done')) continue;
          if (!botMessageCreated) {
            botMessageCreated = true;
            setMessages((prev) => [
              ...prev,
              { id: botMessageId, type: 'bot', content: '', timestamp: new Date() },
            ]);
          }
          streamedReply += eventData;
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
        content: 'Error de conexión con LideraBot.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <Card className="flex flex-col h-full shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-primary to-primary/90 text-white rounded-t-lg">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white">LideraBot</h3>
          <p className="text-xs text-white/80">En línea</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'bot' ? 'bg-primary text-white' : 'bg-secondary text-foreground'
              }`}>
                {message.type === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`min-w-0 max-w-[75%] overflow-hidden rounded-2xl px-4 py-2 ${
                message.type === 'bot'
                  ? 'bg-white border shadow-sm'
                  : 'bg-primary text-white'
              }`}>
                {message.type === 'bot' ? (
                  <div className="min-w-0 break-words text-sm leading-6 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:font-semibold [&_ol]:my-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:ml-5 [&_ul]:list-disc">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
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

      {/* Suggested Questions */}
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

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            className="flex-shrink-0"
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            className="flex-shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
