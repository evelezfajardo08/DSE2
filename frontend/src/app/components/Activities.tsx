import { useEffect, useState } from 'react';
import { Flame, Users, Target, Brain, Clock, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4001';

interface Activity {
  id: string;
  title: string;
  description: string;
  skill: 'leadership' | 'communication' | 'decision' | 'teamwork';
  format: 'scenario' | 'practice' | 'reflection';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  scenario: string;
  instructions: string[];
  rubric: Array<{ criterion: string; description: string; weight: number }>;
  sources: string[];
}

interface ActivityAttempt {
  id: string;
  activity_id: string;
  activity_title: string;
  score: number | null;
  feedback: string;
  strengths: string[];
  next_steps: string[];
  rubric_scores: Array<{ criterion: string; score: number; evidence: string; suggestion: string }>;
  sources: string[];
  status: 'evaluated' | 'pending_evaluation';
  submitted_at: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  points?: number;
}

interface GeneratedQuiz {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  questions: QuizQuestion[];
  sourceCitations?: string[];
}

interface ActivitiesProps {
  userEmail?: string;
  completedActivityIds: string[];
  onCompleteActivity: (activityId: string, activitySkill?: string) => void;
  currentStreak: number;
  pendingQuiz?: GeneratedQuiz | null;
  onQuizHandled?: () => void;
  pendingActivityId?: string | null;
  onRecommendedActivityHandled?: () => void;
}

const categoryConfig = {
  leadership: { icon: Flame, label: 'Liderazgo', color: 'text-orange-500' },
  communication: { icon: Users, label: 'Comunicación', color: 'text-blue-500' },
  decision: { icon: Brain, label: 'Toma de Decisiones', color: 'text-purple-500' },
  teamwork: { icon: Target, label: 'Trabajo en Equipo', color: 'text-green-500' },
};

const difficultyConfig: Record<Activity['difficulty'], { label: string; color: string }> = {
  beginner: { label: 'Principiante', color: 'bg-green-100 text-green-700' },
  intermediate: { label: 'Intermedio', color: 'bg-yellow-100 text-yellow-700' },
  advanced: { label: 'Avanzado', color: 'bg-red-100 text-red-700' },
};

export function Activities({ userEmail, completedActivityIds, onCompleteActivity, currentStreak, pendingQuiz, onQuizHandled, pendingActivityId, onRecommendedActivityHandled }: ActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activityResponse, setActivityResponse] = useState('');
  const [activityResult, setActivityResult] = useState<ActivityAttempt | null>(null);
  const [isSubmittingActivity, setIsSubmittingActivity] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [activityError, setActivityError] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [completedGeneratedQuizzes, setCompletedGeneratedQuizzes] = useState<GeneratedQuiz[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    try {
      const storedQuiz = localStorage.getItem(`generated-quiz:${userEmail}`);
      if (storedQuiz) {
        setGeneratedQuiz(JSON.parse(storedQuiz));
      }

      const storedCompleted = localStorage.getItem(`completed-generated-quizzes:${userEmail}`);
      if (storedCompleted) {
        const parsedCompleted = JSON.parse(storedCompleted);
        if (Array.isArray(parsedCompleted)) {
          setCompletedGeneratedQuizzes(parsedCompleted);
        }
      }
    } catch {
      // ignore
    }
  }, [userEmail]);

  useEffect(() => {
    if (!pendingQuiz) return;
    const normalizedQuiz = {
      ...pendingQuiz,
      id: pendingQuiz.id || `generated-ai-quiz-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    };

    setGeneratedQuiz(normalizedQuiz);
    setSelectedActivity(null);
    if (userEmail) {
      localStorage.setItem(`generated-quiz:${userEmail}`, JSON.stringify(normalizedQuiz));
    }
    setSelectedAnswers({});
    setQuizSubmitted(false);
    onQuizHandled?.();
  }, [pendingQuiz, onQuizHandled, userEmail]);

  useEffect(() => {
    if (!pendingActivityId || activities.length === 0) return;
    const activity = activities.find((candidate) => candidate.id === pendingActivityId);
    if (activity) {
      setGeneratedQuiz(null);
      setSelectedActivity(activity);
      setActivityResponse('');
      setActivityResult(null);
      setActivityError('');
    }
    onRecommendedActivityHandled?.();
  }, [pendingActivityId, activities, onRecommendedActivityHandled]);

  useEffect(() => {
    if (!userEmail || !generatedQuiz) return;
    localStorage.setItem(`generated-quiz:${userEmail}`, JSON.stringify(generatedQuiz));
  }, [generatedQuiz, userEmail]);

  useEffect(() => {
    if (!userEmail || completedGeneratedQuizzes.length === 0) return;
    localStorage.setItem(`completed-generated-quizzes:${userEmail}`, JSON.stringify(completedGeneratedQuizzes));
  }, [completedGeneratedQuizzes, userEmail]);

  useEffect(() => {
    let isActive = true;

    fetch(`${API_BASE}/activities`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de actividades');
        }
        const data = await response.json();
        if (isActive) {
          setActivities(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (isActive) {
          setActivities([]);
        }
      });

    const token = localStorage.getItem('access_token') || '';
    fetch(`${API_BASE}/activities/attempts/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        if (isActive) {
          const validAttempts = Array.isArray(data)
            ? data.filter((item: ActivityAttempt) => item.activity_id && !item.activity_id.startsWith('generated'))
            : [];
          setAttempts(validAttempts);
        }
      })
      .catch(() => {
        if (isActive) setAttempts([]);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const completedActivities = activities.filter((activity) => completedActivityIds.includes(activity.id)).length;
  const totalPoints = attempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0);

  const handleSubmitActivity = async () => {
    if (!selectedActivity || !userEmail || activityResponse.trim().length < 10 || activityResult?.status === 'evaluated') return;
    setActivityError('');
    setIsSubmittingActivity(true);

    try {
      const response = await fetch(`${API_BASE}/activities/${selectedActivity.id}/attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify({
          response: activityResponse,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No se pudo guardar tu respuesta.');

      setActivityResult(data);
      setAttempts((previous) => [data, ...previous]);
      onCompleteActivity(selectedActivity.id, selectedActivity.skill);
    } catch (error) {
      setActivityError(error instanceof Error ? error.message : 'No se pudo guardar tu respuesta.');
    } finally {
      setIsSubmittingActivity(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setGeneratedQuiz(null);
    setSelectedActivity(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera un cuestionario de liderazgo con 3 preguntas para estudiantes, en formato JSON válido para una actividad educativa.',
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('No se pudo generar la actividad.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';

        for (const chunk of chunks) {
          const line = chunk.split('\n').find((part) => part.startsWith('data: '));
          if (!line) continue;
          const raw = line.slice(6);
          const eventData = JSON.parse(raw);
          if (eventData?.type === 'quiz' && eventData.payload) {
            setGeneratedQuiz(eventData.payload);
            setIsGeneratingQuiz(false);
            return;
          }
        }

        if (done) break;
      }

      throw new Error('El chatbot no devolvió una actividad válida.');
    } catch (error) {
      console.error('Error generating quiz:', error);
      setGeneratedQuiz(null);
      setIsGeneratingQuiz(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleQuizSubmit = async () => {
    if (!generatedQuiz) return;
    const allAnswered = generatedQuiz.questions.every((_, questionIndex) => selectedAnswers[questionIndex] !== undefined);
    if (!allAnswered) return;

    setQuizSubmitted(true);

    if (!generatedIsCompleted) {
      setActivityError('');
      setIsSubmittingQuiz(true);
      const maxScore = generatedQuiz.questions.reduce((sum, question) => sum + (question.points ?? 10), 0);

      try {
        const response = await fetch(`${API_BASE}/activities/generated-attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
          },
          body: JSON.stringify({
            quizId: generatedQuizId,
            title: generatedQuiz.title,
            skill: generatedQuiz.category || 'leadership',
            score: getQuizScore(),
            maxScore,
            response: JSON.stringify(generatedQuiz.questions.map((question, index) => ({
              question: question.question,
              selectedOption: question.options[selectedAnswers[index]],
            }))),
            sourceCitations: generatedQuiz.sourceCitations || [],
          }),
        });
        const attempt = await response.json();
        if (!response.ok) throw new Error(attempt.message || 'No se pudo guardar el resultado.');

        setAttempts((current) => [attempt, ...current]);
        onCompleteActivity(generatedQuizId, generatedQuiz.category || 'leadership');
        const normalizedQuiz = { ...generatedQuiz, id: generatedQuizId };
        setCompletedGeneratedQuizzes((current) => current.some((quiz) => quiz.id === normalizedQuiz.id)
          ? current
          : [normalizedQuiz, ...current]);
      } catch (error) {
        setActivityError(error instanceof Error ? error.message : 'No se pudo guardar el resultado. Inténtalo de nuevo.');
      } finally {
        setIsSubmittingQuiz(false);
      }
    }
  };

  const getQuizScore = () => {
    if (!generatedQuiz) return 0;
    return generatedQuiz.questions.reduce((sum, question, index) => {
      const selected = selectedAnswers[index];
      if (selected === question.correctIndex) {
        return sum + (question.points ?? 10);
      }
      return sum;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Ejercicios de Liderazgo</h2>
        <p className="text-muted-foreground mt-1">
          Desarrolla tus habilidades a través de retos prácticos y situaciones reales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completadas</p>
              <p className="text-2xl">{completedActivities}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Puntos Totales</p>
              <p className="text-2xl">{totalPoints}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Racha Actual</p>
              <p className="text-2xl">{currentStreak} días</p>
            </div>
          </div>
        </Card>
      </div>

      {selectedActivity && (
        <Card className="p-6 shadow-md">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">{selectedActivity.skill}</p>
              <h3 className="mt-1">{selectedActivity.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{selectedActivity.scenario}</p>
            </div>
            <Button variant="outline" onClick={() => { setSelectedActivity(null); setActivityResult(null); setActivityError(''); }}>
              Volver
            </Button>
          </div>
          <ol className="mb-5 list-decimal space-y-2 pl-5 text-sm">
            {selectedActivity.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
          </ol>
          <label className="mb-2 block text-sm font-medium" htmlFor="activity-response">Tu respuesta</label>
          <textarea
            id="activity-response"
            value={activityResponse}
            onChange={(event) => setActivityResponse(event.target.value)}
            rows={5}
            maxLength={5000}
            placeholder="Explica cómo actuarías y por qué..."
            className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={activityResult?.status === 'evaluated' || isSubmittingActivity}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Mínimo 10 caracteres</span>
            <span>{activityResponse.length}/5000</span>
          </div>
          {activityError && <p className="mt-3 text-sm text-red-600">{activityError}</p>}
          {activityResult?.status !== 'evaluated' && (
            <Button
              className="mt-4"
              onClick={handleSubmitActivity}
              disabled={activityResponse.trim().length < 10 || isSubmittingActivity}
            >
              {isSubmittingActivity ? 'Evaluando...' : activityResult ? 'Reintentar evaluación' : 'Enviar para retroalimentación'}
            </Button>
          )}
          {activityResult && (
            <div className="mt-5 space-y-4 rounded-lg bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <h4>Retroalimentación</h4>
                <Badge variant="secondary">
                  {activityResult.score === null ? 'Pendiente' : `${activityResult.score}/100`}
                </Badge>
              </div>
              <p className="text-sm">{activityResult.feedback}</p>
              {activityResult.strengths.length > 0 && (
                <div><p className="text-sm font-medium">Fortalezas</p><ul className="list-disc pl-5 text-sm">{activityResult.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div>
              )}
              {activityResult.next_steps.length > 0 && (
                <div><p className="text-sm font-medium">Siguiente paso</p><ul className="list-disc pl-5 text-sm">{activityResult.next_steps.map((item) => <li key={item}>{item}</li>)}</ul></div>
              )}
              {activityResult.rubric_scores.length > 0 && (
                <div className="space-y-2">
                  {activityResult.rubric_scores.map((item) => (
                    <div key={item.criterion} className="border-t pt-2 text-sm">
                      <div className="flex justify-between gap-4"><span>{item.criterion}</span><span>{item.score}/100</span></div>
                      {item.evidence && <p className="text-muted-foreground">{item.evidence}</p>}
                      {item.suggestion && <p>{item.suggestion}</p>}
                    </div>
                  ))}
                </div>
              )}
              {activityResult.sources.length > 0 && <p className="text-xs text-muted-foreground">Fuentes: {activityResult.sources.join('; ')}</p>}
            </div>
          )}
        </Card>
      )}

      {generatedQuiz && (
        <Card className="p-5 shadow-md">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-primary font-semibold">Actividad generada</p>
            <h3 className="mt-1">{generatedQuiz.title}</h3>
            {generatedQuiz.description && (
              <p className="text-sm text-muted-foreground mt-1">{generatedQuiz.description}</p>
            )}
            {generatedQuiz.sourceCitations && generatedQuiz.sourceCitations.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">Fuentes: {generatedQuiz.sourceCitations.join('; ')}</p>
            )}
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              <span>{generatedQuiz.category ?? 'Liderazgo'}</span>
              <span>•</span>
              <span>{generatedQuiz.difficulty ?? 'Intermedio'}</span>
            </div>
          </div>

          <div className="space-y-5">
            {generatedQuiz.questions.map((question, questionIndex) => {
              const selected = selectedAnswers[questionIndex];
              const showFeedback = quizSubmitted && selected !== undefined;

              return (
                <div key={`${generatedQuiz.title}-${questionIndex}`} className="space-y-3 rounded-xl border p-3">
                  <p className="font-medium">{questionIndex + 1}. {question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      const isCorrectOption = optionIndex === question.correctIndex;

                      return (
                        <button
                          key={`${question.question}-${optionIndex}`}
                          type="button"
                          onClick={() => handleOptionSelect(questionIndex, optionIndex)}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                            isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-primary/40'
                          } ${
                            showFeedback && isCorrectOption ? 'border-green-500 bg-green-50 text-green-700' : ''
                          } ${
                            showFeedback && isSelected && !isCorrectOption ? 'border-red-500 bg-red-50 text-red-700' : ''
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback && (
                    <div className="text-xs rounded-md bg-muted px-2 py-2">
                      {selected === question.correctIndex ? '✅ Correcto.' : `❌ Correcta: ${question.options[question.correctIndex]}`}
                      {question.explanation && <div className="mt-1">{question.explanation}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              {quizSubmitted ? `Puntuación: ${getQuizScore()} pts` : 'Responde para ver tu resultado.'}
            </div>
            <Button onClick={handleQuizSubmit} className="bg-primary hover:bg-primary/90">
              {generatedIsCompleted ? 'Actividad completada' : isSubmittingQuiz ? 'Guardando resultado...' : 'Enviar respuestas'}
            </Button>
          </div>
          {activityError && <p className="mt-2 text-sm text-red-600">{activityError}</p>}
        </Card>
      )}

      {activities.length === 0 && (
        <Card className="p-5 shadow-md border-dashed">
          <p className="text-sm text-muted-foreground">
            Aún no hay actividades disponibles en este momento.
          </p>
        </Card>
      )}

      {activities.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            const isCompleted = completedActivityIds.includes(activity.id);
            const categoryInfo = categoryConfig[activity.skill];
            const CategoryIcon = categoryInfo.icon;
            const difficultyInfo = difficultyConfig[activity.difficulty];
            const latestAttempt = attempts.find((attempt) => attempt.activity_id === activity.id);

            return (
              <Card key={activity.id} className="p-5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                {isCompleted && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-accent text-white">Completada</Badge>
                  </div>
                )}

                <div className="space-y-4">
                  <div className={`w-12 h-12 ${isCompleted ? 'bg-accent/10' : 'bg-primary/10'} rounded-lg flex items-center justify-center`}>
                    <CategoryIcon className={`w-6 h-6 ${isCompleted ? 'text-accent' : categoryInfo.color}`} />
                  </div>

                  <div>
                    <h3 className="mb-2">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={difficultyInfo.color}>
                      {difficultyInfo.label}
                    </Badge>
                    <Badge variant="outline">
                      {categoryInfo.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{activity.durationMinutes} min</span>
                    </div>
                      <div className="flex items-center gap-1"><span>{activity.format === 'scenario' ? 'Escenario' : activity.format === 'practice' ? 'Práctica' : 'Reflexión'}</span></div>
                  </div>

                  <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => { setSelectedActivity(activity); setActivityResponse(''); setActivityResult(null); setActivityError(''); }}
                  >
                      {isCompleted ? 'Practicar de nuevo' : 'Iniciar actividad'}
                  </Button>
                    {latestAttempt && <p className="text-xs text-muted-foreground">Último intento: {latestAttempt.score === null ? 'evaluación pendiente' : `${latestAttempt.score}/100`}</p>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
