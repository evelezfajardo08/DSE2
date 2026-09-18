import { Flame, Users, Target, Brain, Clock, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'leadership' | 'communication' | 'decision' | 'teamwork';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  points: number;
  completed: boolean;
}

const activities: Activity[] = [
  {
    id: '1',
    title: 'El Dilema del Líder',
    description: 'Enfrenta una situación de crisis y toma decisiones bajo presión manteniendo el equilibrio del equipo',
    category: 'leadership',
    difficulty: 'advanced',
    duration: 20,
    points: 150,
    completed: false,
  },
  {
    id: '2',
    title: 'Comunicación Asertiva',
    description: 'Practica dar retroalimentación constructiva en diferentes escenarios laborales',
    category: 'communication',
    difficulty: 'intermediate',
    duration: 15,
    points: 100,
    completed: true,
  },
  {
    id: '3',
    title: 'Resolución de Conflictos',
    description: 'Medía en una disputa entre dos miembros del equipo y encuentra una solución ganar-ganar',
    category: 'teamwork',
    difficulty: 'intermediate',
    duration: 25,
    points: 120,
    completed: false,
  },
  {
    id: '4',
    title: 'Análisis FODA Personal',
    description: 'Identifica tus fortalezas, oportunidades, debilidades y amenazas como líder',
    category: 'leadership',
    difficulty: 'beginner',
    duration: 10,
    points: 50,
    completed: true,
  },
  {
    id: '5',
    title: 'Decisión Estratégica',
    description: 'Analiza datos de mercado y toma una decisión estratégica para la organización',
    category: 'decision',
    difficulty: 'advanced',
    duration: 30,
    points: 200,
    completed: false,
  },
  {
    id: '6',
    title: 'Presentación Persuasiva',
    description: 'Prepara y presenta una propuesta convincente ante un comité de inversión',
    category: 'communication',
    difficulty: 'advanced',
    duration: 20,
    points: 150,
    completed: false,
  },
];

const categoryConfig = {
  leadership: { icon: Flame, label: 'Liderazgo', color: 'text-orange-500' },
  communication: { icon: Users, label: 'Comunicación', color: 'text-blue-500' },
  decision: { icon: Brain, label: 'Toma de Decisiones', color: 'text-purple-500' },
  teamwork: { icon: Target, label: 'Trabajo en Equipo', color: 'text-green-500' },
};

const difficultyConfig = {
  beginner: { label: 'Principiante', color: 'bg-green-100 text-green-700' },
  intermediate: { label: 'Intermedio', color: 'bg-yellow-100 text-yellow-700' },
  advanced: { label: 'Avanzado', color: 'bg-red-100 text-red-700' },
};

export function Activities() {
  const completedActivities = activities.filter(a => a.completed).length;
  const totalPoints = activities.filter(a => a.completed).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Ejercicios de Liderazgo</h2>
        <p className="text-muted-foreground mt-1">
          Desarrolla tus habilidades a través de retos prácticos y situaciones reales
        </p>
      </div>

      {/* Stats */}
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
              <p className="text-2xl">7 días</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activities Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => {
          const categoryInfo = categoryConfig[activity.category];
          const CategoryIcon = categoryInfo.icon;
          const difficultyInfo = difficultyConfig[activity.difficulty];

          return (
            <Card key={activity.id} className="p-5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
              {activity.completed && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-accent text-white">Completada</Badge>
                </div>
              )}

              <div className="space-y-4">
                {/* Icon */}
                <div className={`w-12 h-12 ${activity.completed ? 'bg-accent/10' : 'bg-primary/10'} rounded-lg flex items-center justify-center`}>
                  <CategoryIcon className={`w-6 h-6 ${activity.completed ? 'text-accent' : categoryInfo.color}`} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="mb-2">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={difficultyInfo.color}>
                    {difficultyInfo.label}
                  </Badge>
                  <Badge variant="outline">
                    {categoryInfo.label}
                  </Badge>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary" />
                    <span>{activity.points} pts</span>
                  </div>
                </div>

                {/* Action */}
                <Button 
                  className={`w-full ${activity.completed ? 'bg-muted hover:bg-muted/80 text-muted-foreground' : 'bg-primary hover:bg-primary/90'}`}
                  disabled={activity.completed}
                >
                  {activity.completed ? 'Revisar' : 'Comenzar'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
