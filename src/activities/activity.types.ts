export type ActivitySkill = 'leadership' | 'communication' | 'decision' | 'teamwork';
export type ActivityFormat = 'scenario' | 'practice' | 'reflection';
export type ActivityDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ActivityRubricCriterion {
  criterion: string;
  description: string;
  weight: number;
}

export interface ActivityDefinition {
  id: string;
  title: string;
  description: string;
  skill: ActivitySkill;
  format: ActivityFormat;
  difficulty: ActivityDifficulty;
  durationMinutes: number;
  scenario: string;
  instructions: string[];
  rubric: ActivityRubricCriterion[];
  sources: string[];
}

export interface ActivityRubricScore {
  criterion: string;
  score: number;
  evidence: string;
  suggestion: string;
}

export interface ActivityEvaluation {
  score: number | null;
  feedback: string;
  strengths: string[];
  nextSteps: string[];
  rubricScores: ActivityRubricScore[];
  sources: string[];
  status: 'evaluated' | 'pending_evaluation';
}