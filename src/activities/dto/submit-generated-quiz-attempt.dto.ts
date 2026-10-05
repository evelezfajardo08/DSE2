export class SubmitGeneratedQuizAttemptDto {
  quizId: string;
  title: string;
  skill: string;
  score: number;
  maxScore: number;
  response: string;
  sourceCitations?: string[];
}