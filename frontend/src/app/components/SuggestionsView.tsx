import { useState, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  HeartHandshake,
  Mail,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:4001');

interface SuggestionRecord {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface SuggestionsViewProps {
  userId: number;
  userName: string;
  userEmail: string;
  onBack: () => void;
}

export function SuggestionsView({
  userId,
  userName,
  userEmail,
  onBack,
}: SuggestionsViewProps) {
  const [category, setCategory] = useState('Sugerencia pedagógica');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pastSuggestions, setPastSuggestions] = useState<SuggestionRecord[]>([]);
  const [isLoadingPast, setIsLoadingPast] = useState(true);

  const categories = [
    { label: 'Sugerencia pedagógica o de contenido', icon: Lightbulb, value: 'Sugerencia pedagógica' },
    { label: 'Pregunta o duda académica', icon: HelpCircle, value: 'Pregunta académica' },
    { label: 'Dificultad técnica o de acceso', icon: AlertTriangle, value: 'Dificultad técnica' },
    { label: 'Petición, Queja o Reclamo (PQRS)', icon: Info, value: 'PQRS' },
    { label: 'Felicitación o comentario general', icon: HeartHandshake, value: 'Comentario general' },
  ];

  const loadPastSuggestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/suggestions/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPastSuggestions(data);
      }
    } catch {
      // Ignorar error al cargar historial
    } finally {
      setIsLoadingPast(false);
    }
  };

  useEffect(() => {
    void loadPastSuggestions();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage('Por favor ingresa un mensaje detallado de al menos 5 caracteres.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Por favor especifica un asunto para tu mensaje.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          category,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'No se pudo enviar el mensaje.');
      }

      setSubmitSuccess(true);
      setSubject('');
      setMessage('');
      void loadPastSuggestions();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al enviar mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1040px] px-5 py-8 lg:px-8 lg:py-10">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#53627A] hover:text-[#0F3B8F] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </button>

      {/* Banner Principal */}
      <section className="rounded-[28px] bg-[#0F3B8F] p-6 text-white md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FACC15] mb-2">
              <MessageSquare className="h-3.5 w-3.5" /> Buzón de Mensajes y Sugerencias
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Canal Directo con el Equipo Docente
            </h1>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              Tu opinión, dudas pedagógicas y sugerencias nos ayudan a enriquecer la plataforma.
              Los mensajes enviados en este buzón son notificados directamente a los correos de tus docentes registrados.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
            <Mail className="mx-auto h-7 w-7 text-[#FACC15]" />
            <p className="mt-1 text-xs font-bold text-white">Canal Oficial</p>
            <p className="text-[11px] text-blue-100">Notificación al docente</p>
          </div>
        </div>
      </section>

      {/* Banner de Contacto Oficial / PQRS (Requerido) */}
      <section className="mt-6 rounded-2xl border-2 border-[#2D6BFF]/20 bg-[#F0F5FF] p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2D6BFF] text-white">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-black text-[#10264F]">
              Información de Atención al Estudiante y PQRS
            </h2>
            <p className="text-xs leading-relaxed text-[#31415E]">
              Para requerimientos institucionales formales, dudas de certificación o mayor información,
              puedes radicar una solicitud formal enviando una PQRS al correo electrónico oficial:
            </p>
            <div className="pt-1">
              <a
                href="mailto:liderabot.app@gmail.com"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#2D6BFF]/30 px-3 py-1.5 text-xs font-black text-[#0F3B8F] hover:bg-blue-50 transition-colors shadow-xs"
              >
                <Mail className="h-3.5 w-3.5 text-[#2D6BFF]" />
                liderabot.app@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-start">
        {/* Formulario de Envío */}
        <Card className="rounded-[24px] border border-[#DCE3EF] bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#10264F]">
            Redactar Mensaje o Sugerencia
          </h2>
          <p className="mt-1 text-xs text-[#66738A]">
            Completa los siguientes campos para enviar tu comentario al equipo docente.
          </p>

          {submitSuccess && (
            <div className="mt-5 rounded-2xl border border-[#A7E8D0] bg-[#EFFBF7] p-4 text-[#0E785F]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0E785F] mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-extrabold">¡Mensaje enviado con éxito!</p>
                  <p className="text-xs text-[#136C56] leading-relaxed">
                    Tu mensaje ha sido registrado y notificado por correo a las cuentas de los docentes.
                    Puedes realizar seguimiento o enviar un nuevo mensaje si lo requieres.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-2 text-xs font-bold underline hover:no-underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Remitente Info */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#53627A] mb-1.5">
                  Estudiante Remitente
                </label>
                <Input
                  value={userName}
                  disabled
                  className="rounded-xl border-[#DCE3EF] bg-[#F8FAFC] text-xs font-semibold text-[#10264F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#53627A] mb-1.5">
                  Correo Electrónico
                </label>
                <Input
                  value={userEmail}
                  disabled
                  className="rounded-xl border-[#DCE3EF] bg-[#F8FAFC] text-xs font-semibold text-[#10264F]"
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-bold text-[#53627A] mb-2">
                Tipo o Categoría del Mensaje
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.value;
                  return (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-[#0F3B8F] bg-[#EAF0FF] text-[#0F3B8F] shadow-xs'
                          : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#0F3B8F]' : 'text-slate-400'}`} />
                      <span className="truncate">{cat.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asunto */}
            <div>
              <label className="block text-xs font-bold text-[#53627A] mb-1.5">
                Asunto del Mensaje *
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: Consulta sobre la retroalimentación del Módulo 2"
                maxLength={100}
                required
                className="rounded-xl border-[#DCE3EF] bg-white text-xs font-medium focus:border-[#0F3B8F]"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-xs font-bold text-[#53627A] mb-1.5">
                Descripción detallada o mensaje *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje, sugerencia pedagógica, duda o requerimiento con el mayor detalle posible..."
                rows={5}
                required
                className="w-full resize-y rounded-xl border border-[#DCE3EF] bg-white p-3.5 text-xs leading-relaxed outline-none transition focus:border-[#0F3B8F] focus:ring-2 focus:ring-[#0F3B8F]/10"
              />
              <p className="mt-1 text-right text-[11px] text-[#8C9AA8]">
                {message.length} caracteres
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#0F3B8F] py-3 text-xs font-extrabold text-white shadow-md hover:bg-[#174AA6] transition-all"
            >
              <Send className="mr-2 h-4 w-4 text-[#FACC15]" />
              {isSubmitting ? 'Enviando mensaje al equipo docente...' : 'Enviar Mensaje al Equipo Docente'}
            </Button>
          </form>
        </Card>

        {/* Historial de Sugerencias y Mensajes del Estudiante */}
        <div className="space-y-4">
          <Card className="rounded-[24px] border border-[#DCE3EF] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-[#E4EAF3] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#10264F]">
                  Tus Mensajes Enviados
                </h3>
                <p className="text-xs text-[#66738A]">
                  Historial de consultas y sugerencias registradas
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-bold">
                {pastSuggestions.length}
              </Badge>
            </div>

            <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {isLoadingPast ? (
                <p className="text-center py-6 text-xs text-[#8C9AA8]">
                  Cargando tus mensajes anteriores...
                </p>
              ) : pastSuggestions.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200">
                  <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-xs font-bold text-[#475569]">
                    No has enviado mensajes aún
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C9AA8]">
                    Usa el formulario para comunicarte con tus docentes.
                  </p>
                </div>
              ) : (
                pastSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#E4EAF3] bg-[#F8FAFD] p-3.5 space-y-1.5 transition-all hover:border-[#CBD5E1]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-block rounded-full bg-[#E2E8F0] px-2 py-0.5 text-[10px] font-bold text-[#334155]">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-[#8C9AA8] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(item.created_at).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#10264F]">{item.subject}</p>
                    <p className="text-[11px] text-[#475569] line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.status === 'reviewed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status === 'reviewed' ? '✓ Revisado por docente' : '⏳ Pendiente de revisión'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
