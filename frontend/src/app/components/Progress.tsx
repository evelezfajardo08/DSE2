import { TrendingUp, Award, Target, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress as ProgressBar } from './ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const weeklyProgress = [
  { day: 'Lun', actividades: 2, tiempo: 45 },
  { day: 'Mar', actividades: 3, tiempo: 60 },
  { day: 'Mié', actividades: 1, tiempo: 30 },
  { day: 'Jue', actividades: 4, tiempo: 75 },
  { day: 'Vie', actividades: 2, tiempo: 50 },
  { day: 'Sáb', actividades: 0, tiempo: 0 },
  { day: 'Dom', actividades: 1, tiempo: 20 },
];

const skillsData = [
  { skill: 'Liderazgo', value: 85 },
  { skill: 'Comunicación', value: 78 },
  { skill: 'Toma de Decisiones', value: 70 },
  { skill: 'Trabajo en Equipo', value: 88 },
  { skill: 'Gestión del Tiempo', value: 75 },
];

const achievements = [
  { id: '1', title: 'Primera Evaluación', description: 'Completaste tu primera autoevaluación', date: '15 Oct 2025', icon: '🎯' },
  { id: '2', title: 'Comunicador Efectivo', description: 'Alcanzaste 80% en Comunicación', date: '20 Oct 2025', icon: '💬' },
  { id: '3', title: 'Racha de 7 días', description: 'Mantuviste actividad por 7 días consecutivos', date: '25 Oct 2025', icon: '🔥' },
  { id: '4', title: 'Líder en Desarrollo', description: 'Completaste 10 ejercicios de liderazgo', date: '28 Oct 2025', icon: '👑' },
];

const aiRecommendations = [
  {
    id: '1',
    type: 'strength',
    message: 'Tu habilidad de trabajo en equipo está por encima del promedio. ¡Sigue así!',
  },
  {
    id: '2',
    type: 'improvement',
    message: 'Podrías mejorar en Toma de Decisiones. Te recomiendo el ejercicio "El Dilema del Líder".',
  },
  {
    id: '3',
    type: 'goal',
    message: 'Estás a solo 15 puntos de alcanzar el siguiente nivel. ¡Mantén el ritmo!',
  },
];

export function Progress() {
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
          <h3>Recomendaciones de IA</h3>
        </div>
        <div className="space-y-3">
          {aiRecommendations.map((rec) => (
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
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Nivel" dataKey="value" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

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
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4>Completar 5 evaluaciones</h4>
              <Badge variant="secondary">2/5</Badge>
            </div>
            <ProgressBar value={40} className="h-2" />
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4>Alcanzar nivel avanzado en Liderazgo</h4>
              <Badge variant="secondary">85/100</Badge>
            </div>
            <ProgressBar value={85} className="h-2" />
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4>Mantener racha de 30 días</h4>
              <Badge variant="secondary">7/30</Badge>
            </div>
            <ProgressBar value={23} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}
