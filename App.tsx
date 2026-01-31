
import React, { useState, useEffect, useRef } from 'react';
import { Grade, MathProblem, GameState } from './types';
import { generateProblem } from './services/mathService';
import { getAiFeedback } from './services/geminiService';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    grade: null,
    currentProblem: null,
    isGameOver: false,
    lives: 3,
    streak: 0,
  });

  const [questionCount, setQuestionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [feedback, setFeedback] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<number | null>(null);

  const QUESTIONS_PER_ROUND = 10;

  useEffect(() => {
    if (gameState.grade && !gameState.isGameOver && gameState.currentProblem && !isAiLoading) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.grade, gameState.isGameOver, gameState.currentProblem, isAiLoading]);

  const handleTimeout = () => {
    setLastResult('wrong');
    setFeedback("Vaqt tugadi! Keyingi safar tezroq bo'ling ⏰");
    setGameState(prev => {
      const newLives = prev.lives - 1;
      return {
        ...prev,
        lives: newLives,
        streak: 0,
        isGameOver: newLives <= 0
      };
    });
    setTimeout(nextQuestion, 2000);
  };

  const startGame = (grade: Grade) => {
    const problem = generateProblem(grade);
    setGameState({
      score: 0,
      grade,
      currentProblem: problem,
      isGameOver: false,
      lives: 3,
      streak: 0,
    });
    setQuestionCount(1);
    setTimeLeft(20);
    setFeedback("Keling, o'yinni boshlaymiz! Omad yor bo'lsin! 🚀");
  };

  const nextQuestion = () => {
    setLastResult(null);
    if (gameState.grade) {
      if (questionCount >= QUESTIONS_PER_ROUND) {
        setGameState(prev => ({ ...prev, isGameOver: true }));
        return;
      }
      const problem = generateProblem(gameState.grade);
      setGameState(prev => ({ ...prev, currentProblem: problem }));
      setQuestionCount(prev => prev + 1);
      setTimeLeft(20);
    }
  };

  const handleAnswer = async (selected: number) => {
    if (!gameState.currentProblem || isAiLoading) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = selected === gameState.currentProblem.answer;
    setLastResult(isCorrect ? 'correct' : 'wrong');
    
    setIsAiLoading(true);
    const aiFeedback = await getAiFeedback(
      gameState.currentProblem.question, 
      gameState.grade || 1, 
      isCorrect
    );
    setFeedback(aiFeedback);
    setIsAiLoading(false);

    if (isCorrect) {
      const bonus = Math.floor(timeLeft / 2);
      setGameState(prev => ({
        ...prev,
        score: prev.score + (10 * (prev.grade || 1)) + bonus,
        streak: prev.streak + 1,
      }));
      setTimeout(nextQuestion, 1500);
    } else {
      setGameState(prev => {
        const newLives = prev.lives - 1;
        return {
          ...prev,
          lives: newLives,
          streak: 0,
          isGameOver: newLives <= 0
        };
      });
      setTimeout(nextQuestion, 2500);
    }
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      grade: null,
      currentProblem: null,
      isGameOver: false,
      lives: 3,
      streak: 0,
    });
    setQuestionCount(0);
    setFeedback('');
    setLastResult(null);
  };

  if (gameState.isGameOver) {
    const isWin = gameState.lives > 0;
    return (
      <Layout>
        <div className="text-center space-y-6 py-4">
          <div className="text-7xl mb-4 animate-bounce">
            {isWin ? '🎊' : '🎮'}
          </div>
          <h2 className={`text-4xl font-extrabold ${isWin ? 'text-green-500' : 'text-red-500'}`}>
            {isWin ? "Ajoyib natija!" : "O'yin tugadi!"}
          </h2>
          <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
            <p className="text-gray-600 text-lg">Umumiy ball:</p>
            <p className="text-5xl font-black text-blue-600">{gameState.score}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={resetGame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 rounded-2xl transition-all shadow-lg active:scale-95 text-xl"
            >
              Yana urinib ko'rish 🔄
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!gameState.grade) {
    return (
      <Layout>
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Xush kelibsiz! 👋</h2>
            <p className="text-gray-500">O'zingizga mos sinfni tanlang:</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((g) => (
              <button
                key={g}
                onClick={() => startGame(g as Grade)}
                className="p-6 bg-white border-4 border-sky-100 hover:border-blue-400 hover:bg-blue-50 rounded-3xl transition-all text-center group shadow-sm hover:shadow-md"
              >
                <span className="block text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {g === 1 ? '🎨' : g === 2 ? '🐝' : g === 3 ? '🚀' : '💎'}
                </span>
                <span className="text-xl font-bold text-blue-600">{g}-sinf</span>
              </button>
            ))}
          </div>
          <div className="pt-4 text-sm text-gray-400">
            Har bir raundda 10 ta misol bo'ladi
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-bold text-gray-500 px-1">
            <span>SAVOL {questionCount}/{QUESTIONS_PER_ROUND}</span>
            <span className={timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}>
              Vaqt: {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200">
            <div 
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${(questionCount / QUESTIONS_PER_ROUND) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-bold border border-yellow-200">
              ⭐ {gameState.score}
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-xl ${i < gameState.lives ? 'filter-none' : 'grayscale opacity-30'}`}>
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Problem Area */}
        {gameState.currentProblem && (
          <div className={`text-center py-6 rounded-3xl transition-colors duration-300 ${
            lastResult === 'correct' ? 'bg-green-50' : lastResult === 'wrong' ? 'bg-red-50' : ''
          }`}>
            <div className={`text-5xl md:text-6xl font-black text-blue-600 mb-10 transition-transform ${
              lastResult === 'correct' ? 'scale-110' : ''
            }`}>
              {gameState.currentProblem.question}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {gameState.currentProblem.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={isAiLoading || lastResult !== null}
                  className={`py-5 rounded-2xl text-3xl font-black transition-all shadow-md active:scale-95 border-b-4 
                    ${lastResult === null 
                      ? 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50 active:border-b-0' 
                      : opt === gameState.currentProblem?.answer 
                        ? 'bg-green-500 border-green-700 text-white' 
                        : 'bg-white border-gray-200 text-gray-300'}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Feedback */}
        <div className={`mt-6 p-5 rounded-2xl border-2 min-h-[90px] flex items-center justify-center text-center relative transition-colors duration-300 ${
          lastResult === 'correct' ? 'bg-green-100 border-green-200' : 
          lastResult === 'wrong' ? 'bg-red-100 border-red-200' : 'bg-sky-50 border-sky-100'
        }`}>
          {isAiLoading ? (
            <div className="flex gap-2">
               <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
               <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
               <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
            </div>
          ) : (
            <p className={`font-semibold text-lg ${
              lastResult === 'correct' ? 'text-green-800' : 
              lastResult === 'wrong' ? 'text-red-800' : 'text-blue-800'
            }`}>
              {feedback || "Misolni yechishga tayyormisiz?"}
            </p>
          )}
          <div className="absolute -top-3 left-6 bg-white text-blue-500 text-[10px] font-black px-3 py-0.5 rounded-full border-2 border-blue-100 tracking-wider uppercase">
            Ustoz AI
          </div>
        </div>
        
        <button 
          onClick={resetGame}
          className="w-full text-gray-400 hover:text-gray-600 text-sm font-bold pt-2 flex items-center justify-center gap-2"
        >
          <i className="fas fa-home"></i>
          Bosh sahifaga qaytish
        </button>
      </div>
    </Layout>
  );
};

export default App;
