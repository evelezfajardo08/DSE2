import { useEffect, useState } from 'react';
import { TrendingUp, Award, Target, CheckCircle2, ChevronRight, FileText, Calendar, MessageSquare, Check, HelpCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress as ProgressBar } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const activitySkillMap: Record<string, string> = {
  '1': 'Liderazgo',
  '2': 'Comunicación',
  '3': 'Trabajo en Equipo',
  '4': 'Liderazgo',
  '5': 'Toma de Decisiones',
  '6': 'Comunicación',
};

const skillActivityTotals: Record<string, number> = {
  Liderazgo: 2,
  Comunicación: 1,
  'Toma de Decisiones': 1,
  'Trabajo en Equipo': 2,
};

const suggestedActivityBySkill: Record<string, string> = {
  Liderazgo: 'El liderazgo que necesita el equipo',
  Comunicación: 'Retroalimentación clara y respetuosa',
  'Toma de Decisiones': 'Decidir con criterios claros',
  'Trabajo en Equipo': 'Mediar un desacuerdo',
};

const normalizeSkillName = (value?: string) => {
  const normalizedValue = (value || '').toLowerCase();
  switch (normalizedValue) {
    case 'leadership':
      return 'Liderazgo';
    case 'communication':
      return 'Comunicación';
    case 'decision':
      return 'Toma de Decisiones';
    case 'teamwork':
      return 'Trabajo en Equipo';
    default:
      return value || 'Liderazgo';
  }
};

interface ActivityAttempt {
  id?: string;
  activity_id: string;
  activity_title: string;
  skill: string;
  response?: string;
  score: number | null;
  feedback?: string;
  strengths?: string[];
  next_steps?: string[];
  rubric_scores?: Array<{ criterion: string; score: number; evidence: string; suggestion: string }>;
  sources?: string[];
  status: 'evaluated' | 'pending_evaluation';
  submitted_at: string;
}

interface ProgressProps {
  userId: number;
  completedActivities: number;
  totalActivities: number;
  currentStreak: number;
  activityCompletionDates: string[];
  completedActivityIds: string[];
  completedActivitySkills?: Record<string, string>;
  userEmail?: string;
}

const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.MODE === 'production' ? '' : 'http://localhost:4001');

export function Progress({ userId, completedActivities, totalActivities, currentStreak, activityCompletionDates, completedActivityIds, completedActivitySkills = {}, userEmail }: ProgressProps) {
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<ActivityAttempt | null>(null);

  useEffect(() => {
    let isActive = true;
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
  }, [userId]);

  const effectiveSkillMap: Record<string, string> = {
    ...activitySkillMap,
    ...completedActivitySkills,
  };

  const activityProgress = totalActivities > 0
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  const skillsData = Object.entries(skillActivityTotals).map(([skill, total]) => {
    const evaluatedAttempts = attempts.filter((attempt) =>
      attempt.score !== null && attempt.status === 'evaluated' && normalizeSkillName(attempt.skill) === skill,
    );
    const completedCount = completedActivityIds.filter((activityId) => {
      const mappedSkill = normalizeSkillName(effectiveSkillMap[activityId] || activitySkillMap[activityId] || 'Liderazgo');
      return mappedSkill === skill;
    }).length;
    const value = evaluatedAttempts.length > 0
      ? Math.round(evaluatedAttempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) / evaluatedAttempts.length)
      : total > 0 ? Math.min(100, Math.round((completedCount / total) * 100)) : 0;
    return { skill, value, attemptCount: evaluatedAttempts.length };
  });
  const assessedSkills = skillsData.filter((skill) => skill.attemptCount > 0);
  const strongestSkill = [...assessedSkills].sort((left, right) => right.value - left.value)[0];
  const weakestSkill = [...assessedSkills].sort((left, right) => left.value - right.value)[0];
  const recommendations = attempts.length === 0
    ? [{ id: 'first', type: 'goal', message: 'Completa una actividad para recibir una recomendación basada en tu respuesta.' }]
    : [
      ...(strongestSkill ? [{ id: 'strength', type: 'strength', message: `Tu promedio más alto está en ${strongestSkill.skill} (${strongestSkill.value}/100). Sigue aplicando esa fortaleza.` }] : []),
      ...(weakestSkill ? [{ id: 'improvement', type: 'improvement', message: `Tu próximo foco puede ser ${weakestSkill.skill}. Prueba “${suggestedActivityBySkill[weakestSkill.skill]}” y revisa la retroalimentación.` }] : []),
    ];
  const achievements = [
    ...(attempts.length > 0 ? [{ id: 'practice', title: 'Primera práctica evaluada', description: attempts[attempts.length - 1].activity_title, date: new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(attempts[attempts.length - 1].submitted_at)), icon: '🎯' }] : []),
    ...(strongestSkill && strongestSkill.value >= 80 ? [{ id: 'strength', title: `${strongestSkill.skill} destacada`, description: `Promedio ${strongestSkill.value}/100 en intentos evaluados`, date: 'Actual', icon: '⭐' }] : []),
    ...(currentStreak >= 7 ? [{ id: 'streak', title: 'Racha de 7 días', description: 'Has mantenido tu práctica durante una semana', date: 'Actual', icon: '🔥' }] : []),
  ];
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayOfWeek = (today.getDay() + 6) % 7;
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const weeklyCompletionDates = attempts.length > 0
    ? attempts.map((attempt) => attempt.submitted_at.slice(0, 10))
    : activityCompletionDates;
  const weeklyProgress = weekDays.map((day, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    const dateKey = date.toISOString().slice(0, 10);
    return {
      day,
      actividades: weeklyCompletionDates.filter((completedAt) => completedAt === dateKey).length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Mi Progreso</h2>
        <p className="text-muted-foreground mt-1">
          Visualiza tu evolución y recibe recomendaciones personalizadas
        </p>
      </div>

      {/* AI Recommendations */}
      <Card className="p-6 shadow-md bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3>Sugerencias de práctica</h3>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                rec.type === 'strength' ? 'bg-accent' : 
                rec.type === 'improvement' ? 'bg-secondary' : 'bg-primary'
              }`} />
              <p className="text-sm flex-1">{rec.message}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="p-6 shadow-md">
          <h3 className="mb-4">Actividad Semanal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="actividades" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Skills Radar */}
        <Card className="p-6 shadow-md">
          <h3 className="mb-4">Habilidades</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillsData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <Radar name="Nivel" dataKey="value" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card
        className="p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border hover:border-primary/50 group"
        onClick={() => setIsHistoryOpen(true)}
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="group-hover:text-primary transition-colors">Progreso de actividades</h3>
              <Badge variant="outline" className="text-xs group-hover:bg-primary/10 transition-colors">
                Ver historial y respuestas <ChevronRight className="w-3.5 h-3.5 ml-0.5 inline" />
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {completedActivities} de {totalActivities} actividades completadas (Haz clic para ver detalle)
            </p>
          </div>
          <span className="text-xl font-semibold text-primary">{activityProgress}%</span>
        </div>
        <ProgressBar value={activityProgress} className="h-3" />
      </Card>

      {/* Dialog for Activity History & Responses */}
      <Dialog open={isHistoryOpen} onOpenMaximized={false} onOpenChange={(open) => {
        setIsHistoryOpen(open);
        if (!open) setSelectedAttempt(null);
      }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="w-5 h-5 text-primary" />
              Historial de Actividades Realizadas
            </DialogTitle>
            <DialogDescription>
              Selecciona una actividad para ver la respuesta enviada y su evaluación detallada.
            </DialogDescription>
          </DialogHeader>

          {selectedAttempt ? (
            <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mb-2"
              >
                ← Volver a la lista de intentos
              </button>

              <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-muted/30 rounded-lg border">
                <div>
                  <h4 className="text-base font-semibold">{selectedAttempt.activity_title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(selectedAttempt.submitted_at))}</span>
                    <span>•</span>
                    <Badge variant="secondary" className="capitalize">{normalizeSkillName(selectedAttempt.skill)}</Badge>
                  </div>
                </div>
                {selectedAttempt.score !== null ? (
                  <Badge className="text-sm px-3 py-1 bg-primary text-white">
                    Puntaje: {selectedAttempt.score}/100
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    Pendiente de evaluación
                  </Badge>
                )}
              </div>

              {selectedAttempt.response && (
                <div className="p-4 border rounded-lg bg-card space-y-2">
                  <div className="flex items-center gap-2 font-medium text-sm text-foreground">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Tu respuesta enviada:</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/40 p-3 rounded-md border italic leading-relaxed">
                    "{selectedAttempt.response}"
                  </p>
                </div>
              )}

              {selectedAttempt.feedback && (
                <div className="p-4 border rounded-lg bg-primary/5 space-y-2">
                  <h5 className="font-medium text-sm text-primary">Retroalimentación del Mentor:</h5>
                  <p className="text-sm text-foreground leading-relaxed">{selectedAttempt.feedback}</p>
                </div>
              )}

              {selectedAttempt.strengths && selectedAttempt.strengths.length > 0 && (
                <div className="p-4 border rounded-lg bg-green-50/50 space-y-2">
                  <h5 className="font-medium text-sm text-green-700 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Puntos fuertes identificados:
                  </h5>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    {selectedAttempt.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAttempt.next_steps && selectedAttempt.next_steps.length > 0 && (
                <div className="p-4 border rounded-lg bg-blue-50/50 space-y-2">
                  <h5 className="font-medium text-sm text-blue-700 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> Siguientes pasos recomendados:
                  </h5>
                  <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    {selectedAttempt.next_steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {attempts.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">Aún no has completado ninguna actividad.</p>
                  <p className="text-xs text-muted-foreground mt-1">Ve a la sección de Actividades e inicia tu primera práctica.</p>
                </div>
              ) : (
                attempts.map((attempt, index) => (
                  <div
                    key={attempt.id || `${attempt.activity_id}-${index}`}
                    onClick={() => setSelectedAttempt(attempt)}
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/60 hover:bg-muted/30 cursor-pointer transition-all"
                  >
                    <div className="space-y-1 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-foreground">{attempt.activity_title}</h4>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {normalizeSkillName(attempt.skill)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(attempt.submitted_at))}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {attempt.score !== null ? (
                        <Badge className="bg-primary text-white text-xs px-2.5 py-1">
                          {attempt.score}/100 pts
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Pendiente
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Skills Progress Bars */}
      <Card className="p-6 shadow-md">
        <h3 className="mb-4">Desglose de Habilidades</h3>
        <div className="space-y-4">
          {skillsData.map((skill) => (
            <div key={skill.skill}>
              <div className="flex justify-between mb-2">
                <span>{skill.skill}</span>
                <span className="text-muted-foreground">{skill.value}%</span>
              </div>
              <ProgressBar value={skill.value} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-secondary" />
          <h3>Logros Desbloqueados</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {achievements.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay logros registrados.</p>}
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4>{achievement.title}</h4>
                <p className="text-sm text-muted-foreground mb-1">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">{achievement.date}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
            </div>
          ))}
        </div>
      </Card>

      {/* Goals */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3>Objetivos Actuales</h3>
        </div>
        <div className="space-y-4">
          {weakestSkill && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4>Fortalecer {weakestSkill.skill}</h4>
                <Badge variant="secondary">{weakestSkill.value}/100</Badge>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">Practica “{suggestedActivityBySkill[weakestSkill.skill]}”.</p>
              <ProgressBar value={weakestSkill.value} className="h-2" />
            </div>
          )}
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4>Mantener racha de 30 días</h4>
              <Badge variant="secondary">{currentStreak}/30</Badge>
            </div>
            <ProgressBar value={Math.min((currentStreak / 30) * 100, 100)} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}
