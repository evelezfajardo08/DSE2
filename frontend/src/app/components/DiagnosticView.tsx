import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Eye,
  LockKeyhole,
  RotateCcw,
  X,
} from "lucide-react";
import {
  DiagnosticEvaluationResult,
  calculateDiagnosticResult,
  diagnosticQuestions,
  performanceScale,
} from "../diagnosticData";

interface DiagnosticViewProps {
  studentName: string;
  savedAnswers: Record<number, string>;
  savedResult: DiagnosticEvaluationResult | null;
  unlockedSubmoduleIds: number[];
  completedSubmoduleIds?: number[];
  hasStartedSubmodule?: boolean;
  onSaveProgress: (
    answers: Record<number, string>,
    result: DiagnosticEvaluationResult | null,
  ) => void;
  onAskChatbotFeedback: (prompt: string) => void;
  onOpenSubmodule: (moduleId: number) => void;
  onBack: () => void;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DiagnosticView({
  studentName,
  savedAnswers,
  savedResult,
  hasStartedSubmodule = false,
  onSaveProgress,
  onAskChatbotFeedback,
  onBack,
}: DiagnosticViewProps) {
  const [answers, setAnswers] = useState<Record<number, string>>(savedAnswers);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReport, setShowReport] = useState<boolean>(Boolean(savedResult));
  const [isAnswersModalOpen, setIsAnswersModalOpen] = useState(false);

  const currentQuestion = diagnosticQuestions[currentIdx];
  const answeredCount = diagnosticQuestions.filter(
    (q) => (answers[q.id] || "").trim().length > 0,
  ).length;
  const allAnswered = answeredCount === diagnosticQuestions.length;

  const handleSelectAnswer = (value: string) => {
    const next = { ...answers, [currentQuestion.id]: value };
    setAnswers(next);
    onSaveProgress(next, savedResult);
  };

  const handleFinishDiagnostic = () => {
    const evaluated = calculateDiagnosticResult(answers);
    onSaveProgress(answers, evaluated);
    setShowReport(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetake = () => {
    if (hasStartedSubmodule) return;
    setShowReport(false);
    setCurrentIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeResult = savedResult ?? (allAnswered ? calculateDiagnosticResult(answers) : null);

  if (showReport && activeResult) {
    return (
      <main className="mx-auto max-w-[1040px] px-5 py-8 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#53627A] hover:text-[#0F3B8F]"
          >
            <ArrowLeft className="h-4 w-4" /> Ir a Módulos
          </button>
          <div className="flex flex-wrap items-center gap-2.5">
            {hasStartedSubmodule ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE3EF] bg-[#F1F3F7] px-3.5 py-2 text-xs font-bold text-[#66738A]">
                <LockKeyhole className="h-3.5 w-3.5" /> Diagnóstico cerrado (submódulo iniciado)
              </span>
            ) : (
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE3EF] bg-white px-3.5 py-2 text-xs font-extrabold text-[#0F3B8F] hover:bg-[#F6F8FC]"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Repetir Prueba
              </button>
            )}
            <button
              onClick={() =>
                onAskChatbotFeedback(
                  "Explícame mis resultados de la Prueba Diagnóstica, mis fortalezas, debilidades y qué módulo debo estudiar primero.",
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F3B8F] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#174AA6]"
            >
              <Bot className="h-4 w-4 text-[#FACC15]" /> Consultar con LideraBot
            </button>
          </div>
        </div>

        {/* 1. Resumen de Resultados de la Prueba Diagnóstica */}
        <section className="rounded-[24px] bg-[#0F3B8F] p-6 text-white md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                <ClipboardCheck className="h-3.5 w-3.5 text-[#FACC15]" />
                Prueba Diagnóstica Completada
              </span>
              <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">
                Resultados de {studentName}
              </h1>
              <p className="mt-1.5 text-sm text-blue-100">
                Nivel general obtenido:{" "}
                <strong className="text-[#FACC15]">{activeResult.overallLevelTitle}</strong> (
                {activeResult.overallPercentage}%)
              </p>
            </div>

            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FACC15] px-5 py-3 text-sm font-extrabold text-[#0F3B8F] shadow-md hover:bg-[#FACC15]/90"
            >
              Ver Módulos Desbloqueados
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activeResult.competencyModules.map((mod) => (
              <div
                key={mod.competency}
                className="rounded-2xl border border-white/15 bg-white/10 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-100">{mod.competency}</span>
                  <span className="text-sm font-extrabold text-[#FACC15]">{mod.percentage}%</span>
                </div>
                <p className="mt-1 text-xs font-bold text-white">{mod.levelTitle}</p>
                <p className="mt-1 text-[11px] text-blue-200">{mod.studyStatus}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Apartado clicable para abrir la ventana superpuesta con las respuestas */}
        <section className="mt-6">
          <button
            type="button"
            onClick={() => setIsAnswersModalOpen(true)}
            className="w-full rounded-[22px] border border-[#DCE3EF] bg-white p-6 text-left shadow-sm transition-all hover:border-[#2D6BFF] hover:shadow-md flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EAF0FF] text-[#0F3B8F]">
                <Eye className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-[#10264F] md:text-lg">
                  Respuestas de la prueba diagnóstica
                </h2>
                <p className="mt-0.5 text-xs text-[#66738A]">
                  Haz clic aquí para ver las 14 preguntas y las respuestas que registraste
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F3B8F] px-4 py-2.5 text-xs font-extrabold text-white shrink-0">
              Ver respuestas <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </section>

        {/* Ventana superpuesta (Modal) con las respuestas de la prueba diagnóstica */}
        {isAnswersModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
            onClick={() => setIsAnswersModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-[780px] flex-col overflow-hidden rounded-[26px] border border-[#DCE3EF] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E4EAF3] bg-[#0F3B8F] px-6 py-4 text-white">
                <div>
                  <h3 className="text-lg font-extrabold">Respuestas de la Prueba Diagnóstica</h3>
                  <p className="text-xs text-blue-100">
                    14 preguntas respondidas por {studentName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnswersModalOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                  aria-label="Cerrar ventana"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {diagnosticQuestions.map((q) => {
                  const userAns = answers[q.id] || "";
                  const selectedOption =
                    q.type === "ABC" && q.options
                      ? q.options.find((opt) => opt.letter === userAns)
                      : null;

                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-[#E4EAF3] bg-[#F8FAFD] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#0F3B8F]">
                          P{q.id} · {q.competency}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#DFF5ED] px-2.5 py-0.5 text-[11px] font-bold text-[#0E785F]">
                          <CheckCircle2 className="h-3 w-3" /> Respondida
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm font-bold text-[#10264F]">{q.prompt}</p>
                      <div className="mt-2 rounded-lg bg-white border border-[#DCE3EF] px-3.5 py-2.5 text-xs text-[#31415E]">
                        <strong className="text-[#0F3B8F]">Tu respuesta: </strong>
                        {selectedOption
                          ? `${selectedOption.letter}) ${selectedOption.text}`
                          : userAns || "Sin respuesta"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#E4EAF3] bg-[#F8FAFD] px-6 py-3.5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAnswersModalOpen(false)}
                  className="rounded-xl bg-[#0F3B8F] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#174AA6]"
                >
                  Cerrar ventana
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1160px] px-5 py-8 lg:px-8 lg:py-12">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#53627A] hover:text-[#0F3B8F]"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al chatbot / inicio
        </button>
        {savedResult && (
          <button
            onClick={() => setShowReport(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#EAF0FF] px-4 py-2 text-xs font-extrabold text-[#0F3B8F]"
          >
            Ver último informe diagnóstico →
          </button>
        )}
      </div>

      {/* Header Banner */}
      <section className="rounded-[26px] bg-[#0F3B8F] p-6 text-white md:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
              Evaluación Integrada e Intercalada · 14 Preguntas
            </span>
            <h1 className="mt-3 text-2xl font-extrabold md:text-4xl">
              Prueba Diagnóstica Inicial de Competencias Clave
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-blue-100">
              Evalúa tu nivel inicial (Escala 1 a 5) en{" "}
              <strong className="text-[#FACC15]">
                Comunicación, Liderazgo, Toma de Decisiones y Trabajo en Equipo
              </strong>{" "}
              para que LideraBot desbloquee el módulo exacto por el que debes comenzar.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 text-center border border-white/15">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Progreso</p>
            <p className="mt-1 text-2xl font-extrabold text-[#FACC15]">{answeredCount} / 14</p>
            <p className="text-[11px] text-blue-100">preguntas respondidas</p>
          </div>
        </div>

        {/* Scale Reference */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {performanceScale.map((s) => (
            <div
              key={s.level}
              className="rounded-xl bg-white/10 p-2.5 border border-white/10 text-xs"
            >
              <p className="font-extrabold text-[#FACC15]">{s.title}</p>
              <p className="mt-1 text-[11px] leading-4 text-blue-100 line-clamp-2">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Question Navigator Sidebar */}
        <aside className="h-fit rounded-[22px] border border-[#DCE3EF] bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#0F3B8F] mb-3">
            14 Preguntas Integradas
          </p>
          <div className="grid grid-cols-7 gap-2 lg:grid-cols-2">
            {diagnosticQuestions.map((q, idx) => {
              const isDone = (answers[q.id] || "").trim().length > 0;
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={cn(
                    "flex items-center justify-center rounded-xl border px-3 py-2.5 text-center text-xs font-extrabold transition-all",
                    isCurrent
                      ? "border-[#0F3B8F] bg-[#0F3B8F] text-white"
                      : isDone
                        ? "border-[#CBEAD9] bg-[#F2FBF7] text-[#0E785F]"
                        : "border-[#DCE3EF] bg-[#F8FAFD] text-[#53627A] hover:bg-white",
                  )}
                >
                  <span>P{q.id}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Active Question Card */}
        <motion.article
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-[#DCE3EF] bg-white p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4EAF3] pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#EAF0FF] px-3 py-1 text-xs font-extrabold text-[#2457D5]">
                Pregunta {currentQuestion.id} de 14
              </span>
              <span className="rounded-full bg-[#F5EBFF] px-3 py-1 text-xs font-extrabold text-[#7E22CE]">
                Competencia: {currentQuestion.competency}
              </span>
            </div>
            <span className="text-xs font-bold text-[#66738A]">
              Tipo: {currentQuestion.type === "ABC" ? "Selección Múltiple (ABC)" : "Respuesta Abierta"}
            </span>
          </div>

          <h2 className="mt-6 text-xl font-extrabold leading-snug text-[#10264F] md:text-2xl">
            {currentQuestion.prompt}
          </h2>

          <div className="mt-6">
            {currentQuestion.type === "ABC" && currentQuestion.options ? (
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const selected = answers[currentQuestion.id] === opt.letter;
                  return (
                    <button
                      key={opt.letter}
                      type="button"
                      onClick={() => handleSelectAnswer(opt.letter)}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all md:p-5",
                        selected
                          ? "border-[#2D6BFF] bg-[#EEF3FF] shadow-[0_0_0_3px_rgba(45,107,255,.10)]"
                          : "border-[#DCE3EF] bg-white hover:border-[#9DB6EF] hover:bg-[#FAFBFE]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-extrabold",
                          selected
                            ? "border-[#2D6BFF] bg-[#2D6BFF] text-white"
                            : "border-[#C9D2E1] text-[#68758B]",
                        )}
                      >
                        {opt.letter}
                      </span>
                      <span className="pt-1 text-sm font-semibold leading-6 text-[#31415E] md:text-base">
                        {opt.text}
                      </span>
                      {selected && (
                        <Check className="ml-auto mt-1.5 h-5 w-5 shrink-0 text-[#2D6BFF]" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-extrabold text-[#31415E]">
                  Respuesta / Argumentación:
                </label>
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="min-h-44 w-full resize-y rounded-2xl border border-[#C9D2E1] bg-[#FBFCFE] p-4 text-sm leading-6 outline-none transition focus:border-[#2D6BFF] focus:ring-4 focus:ring-[#2D6BFF]/10"
                />
                <p className="mt-2 text-right text-xs text-[#66738A]">
                  {(answers[currentQuestion.id] || "").length} caracteres · Guardado automático
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#E4EAF3] pt-6">
            <button
              type="button"
              onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#65728A] disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Anterior
            </button>

            <div className="flex flex-wrap items-center gap-3">
              {currentIdx < diagnosticQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F3B8F] px-6 py-3 text-sm font-bold text-white hover:bg-[#174AA6]"
                >
                  Siguiente pregunta <ArrowRight className="h-4 w-4" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleFinishDiagnostic}
                disabled={!allAnswered}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FACC15] px-6 py-3 text-sm font-extrabold text-[#0F3B8F] shadow-md transition-all hover:bg-[#FACC15]/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Compass className="h-4 w-4" />
                {allAnswered
                  ? "Finalizar Diagnóstico y Desbloquear Módulo Recomendado"
                  : `Responde las ${14 - answeredCount} restantes para finalizar`}
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </main>
  );
}
