
export type Grade = 1 | 2 | 3 | 4;

export interface MathProblem {
  question: string;
  answer: number;
  options: number[];
  difficulty: Grade;
}

export interface GameState {
  score: number;
  grade: Grade | null;
  currentProblem: MathProblem | null;
  isGameOver: boolean;
  lives: number;
  streak: number;
}
