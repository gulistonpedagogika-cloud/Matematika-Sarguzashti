
import { Grade, MathProblem } from '../types';

export const generateProblem = (grade: Grade): MathProblem => {
  let a: number, b: number, op: string, answer: number;

  switch (grade) {
    case 1: // Addition and subtraction within 20
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '+') {
        a = Math.floor(Math.random() * 11);
        b = Math.floor(Math.random() * (20 - a));
        answer = a + b;
      } else {
        a = Math.floor(Math.random() * 11) + 10;
        b = Math.floor(Math.random() * 10) + 1;
        answer = a - b;
      }
      break;

    case 2: // Addition/Subtraction within 100, basic multiplication (2, 3, 5)
      const type2 = Math.random();
      if (type2 < 0.4) {
        op = '+';
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 40) + 5;
        answer = a + b;
      } else if (type2 < 0.8) {
        op = '-';
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        answer = a - b;
      } else {
        op = '×';
        const mults = [2, 3, 5, 10];
        a = mults[Math.floor(Math.random() * mults.length)];
        b = Math.floor(Math.random() * 10) + 1;
        answer = a * b;
      }
      break;

    case 3: // Full multiplication table, simple division
      const type3 = Math.random();
      if (type3 < 0.6) {
        op = '×';
        a = Math.floor(Math.random() * 8) + 2;
        b = Math.floor(Math.random() * 8) + 2;
        answer = a * b;
      } else {
        op = '÷';
        b = Math.floor(Math.random() * 8) + 2;
        answer = Math.floor(Math.random() * 9) + 2;
        a = b * answer;
      }
      break;

    case 4: // Triple digit addition, complex multiplication/division
    default:
      const type4 = Math.random();
      if (type4 < 0.3) {
        op = '+';
        a = Math.floor(Math.random() * 400) + 100;
        b = Math.floor(Math.random() * 400) + 100;
        answer = a + b;
      } else if (type4 < 0.7) {
        op = '×';
        a = Math.floor(Math.random() * 12) + 5;
        b = Math.floor(Math.random() * 15) + 2;
        answer = a * b;
      } else {
        op = '÷';
        b = Math.floor(Math.random() * 12) + 2;
        answer = Math.floor(Math.random() * 30) + 5;
        a = b * answer;
      }
      break;
  }

  const question = `${a} ${op} ${b} = ?`;
  
  // Generate smart distractors
  const optionsSet = new Set<number>([answer]);
  while (optionsSet.size < 4) {
    let fake;
    const strategy = Math.random();
    if (strategy < 0.3) fake = answer + 10;
    else if (strategy < 0.6) fake = answer - 10;
    else if (strategy < 0.8) fake = answer + (Math.random() > 0.5 ? 1 : -1);
    else fake = answer + Math.floor(Math.random() * 5) + 2;

    if (fake >= 0 && fake !== answer) optionsSet.add(fake);
  }

  return {
    question,
    answer,
    options: Array.from(optionsSet).sort((x, y) => x - y),
    difficulty: grade
  };
};
