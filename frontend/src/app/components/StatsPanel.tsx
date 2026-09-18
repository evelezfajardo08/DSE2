import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface StatsData {
  overallProgress: number;
  activitiesCompleted: number;
  currentStreak: number;
  skills: Skill[];
  recentBadges: string[];
}

interface StatsPanelProps {
  data: StatsData;
}

export function StatsPanel({ data }: StatsPanelProps) {
  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card className="p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3>Progreso General</h3>
          </div>
          <span className="text-primary">{data.overallProgress}%</span>
        </div>
        <Progress value={data.overallProgress} className="h-2" />
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 shadow-md">
          <div className="flex flex-col gap-2">
            <Target className="w-5 h-5 text-accent" />
            <p className="text-sm text-muted-foreground">Actividades</p>
            <p className="text-2xl">{data.activitiesCompleted}</p>
          </div>
        </Card>
        
        <Card className="p-4 shadow-md">
          <div className="flex flex-col gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            <p className="text-sm text-muted-foreground">Racha</p>
            <p className="text-2xl">{data.currentStreak} días</p>
          </div>
        </Card>
      </div>

      {/* Skills */}
      <Card className="p-4 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h3>Habilidades</h3>
        </div>
        <div className="space-y-3">
          {data.skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
              <Progress 
                value={skill.level} 
                className="h-2"
                style={{ 
                  ['--progress-background' as string]: skill.color 
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Badges */}
      <Card className="p-4 shadow-md">
        <h4 className="mb-3">Logros Recientes</h4>
        <div className="flex flex-wrap gap-2">
          {data.recentBadges.map((badge, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/20 text-secondary-foreground">
              {badge}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
