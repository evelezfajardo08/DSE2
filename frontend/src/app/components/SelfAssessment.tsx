import { CheckCircle2, Clock, PlayCircle, Trophy } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: number;
  duration: number;
  completed: boolean;
  score?: number;
}

const assessments: Assessment[] = [
  {
    id: '1',
    title: 'Evaluación de Liderazgo',
    description: 'Identifica tu estilo de liderazgo y áreas de desarrollo',
    category: 'Liderazgo',
    questions: 15,
    duration: 10,
    completed: true,
    score: 85,
  },
  {
    id: '2',
    title: 'Comunicación Efectiva',
    description: 'Evalúa tus habilidades de comunicación verbal y no verbal',
    category: 'Comunicación',
    questions: 12,
    duration: 8,
    completed: true,
    score: 78,
  },
  {
    id: '3',
    title: 'Toma de Decisiones',
    description: 'Mide tu capacidad para analizar situaciones y tomar decisiones',
    category: 'Toma de Decisiones',
    questions: 20,
    duration: 15,
    completed: false,
  },
  {
    id: '4',
    title: 'Trabajo en Equipo',
    description: 'Evalúa tu capacidad de colaboración y resolución de conflictos',
    category: 'Colaboración',
    questions: 18,
    duration: 12,
    completed: false,
  },
  {
    id: '5',
    title: 'Gestión del Tiempo',
    description: 'Analiza tus hábitos de organización y priorización',
    category: 'Productividad',
    questions: 10,
    duration: 7,
    completed: false,
  },
];

export function SelfAssessment() {
  const completedCount = assessments.filter(a => a.completed).length;
  const totalCount = assessments.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Autoevaluaciones</h2>
        <p className="text-muted-foreground mt-1">
          Completa las evaluaciones para identificar tus fortalezas y áreas de mejora
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            <h3>Progreso de Evaluaciones</h3>
          </div>
          <span className="text-muted-foreground">
            {completedCount} de {totalCount} completadas
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </Card>

      {/* Assessments Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3>{assessment.title}</h3>
                    {assessment.completed && (
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {assessment.description}
                  </p>
                </div>
              </div>

              {/* Category Badge */}
              <Badge variant="secondary" className="w-fit">
                {assessment.category}
              </Badge>

              {/* Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>{assessment.questions} preguntas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{assessment.duration} min</span>
                </div>
              </div>

              {/* Score or Action */}
              {assessment.completed && assessment.score ? (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm">Calificación:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-primary">{assessment.score}%</span>
                  </div>
                </div>
              ) : (
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Iniciar Evaluación
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
