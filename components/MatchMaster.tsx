import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, Trophy, Play } from 'lucide-react';
import { VOCABULARY } from '../constants';
import { speak } from '../services/audioService';
import { VocabularyWord } from '../types';

interface MatchMasterProps {
  onBack: () => void;
}

const GAME_DURATION = 60; // seconds

const MatchMaster: React.FC<MatchMasterProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [target, setTarget] = useState<VocabularyWord | null>(null);
  const [options, setOptions] = useState<VocabularyWord[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [highScore, setHighScore] = useState(0);

  const timerRef = useRef<number>();

  // Start / Restart Game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFeedback('none');
    generateRound();

    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setTarget(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Check for high score updates
  useEffect(() => {
    if (!isPlaying && score > highScore) {
      setHighScore(score);
    }
  }, [isPlaying, score, highScore]);

  const generateRound = () => {
    const randomTarget = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    
    // Pick 3 distractors that are distinct from target
    const distractors: VocabularyWord[] = [];
    while (distractors.length < 3) {
      const d = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
      if (d.english !== randomTarget.english && !distractors.find(x => x.english === d.english)) {
        distractors.push(d);
      }
    }

    const roundOptions = [...distractors, randomTarget].sort(() => 0.5 - Math.random());
    
    setTarget(randomTarget);
    setOptions(roundOptions);
  };

  const handleAnswer = (selectedWord: VocabularyWord) => {
    if (!target || feedback !== 'none') return;

    if (selectedWord.english === target.english) {
      // Correct
      setFeedback('correct');
      setScore(s => s + 1);
      speak(selectedWord.english); // Speed learning
      
      // Quick delay before next round to show green color
      setTimeout(() => {
        setFeedback('none');
        generateRound();
      }, 300); // Very fast transition for "Speed" feel
    } else {
      // Wrong
      setFeedback('wrong');
      speak("Oh no");
      setTimeout(() => {
        setFeedback('none');
        // Do not change round, let them try again or maybe change? 
        // For speed game, usually better to move on or penalty. 
        // Let's generate new round to keep flow but penalty time?
        // Let's just shake and let them try again to learn.
      }, 500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-3xl font-bold text-pink-600 hidden md:block">התאמה מהירה (Blitz)</h2>
        <h2 className="text-2xl font-bold text-pink-600 md:hidden">התאמה מהירה</h2>
        <button 
          onClick={onBack}
          className="bg-gray-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={20}/>
          <span className="hidden md:inline">יציאה</span>
        </button>
      </div>

      {!isPlaying ? (
        // Menu / Game Over Screen
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-4 border-pink-100 w-full max-w-md animate-in fade-in zoom-in duration-300">
          <div className="mb-6 flex justify-center text-pink-500">
            <Trophy size={64} />
          </div>
          <h3 className="text-3xl font-bold mb-2 text-slate-800">
            {timeLeft === 0 ? "נגמר הזמן!" : "מוכנים?"}
          </h3>
          
          {score > 0 && (
             <p className="text-2xl mb-6 font-bold text-pink-600">ניקוד אחרון: {score}</p>
          )}
          {highScore > 0 && (
             <p className="text-lg mb-6 text-slate-500">שיא: {highScore}</p>
          )}

          <p className="text-lg text-slate-600 mb-8">
            יש לך 60 שניות! <br/>
            כמה מילים תצליח להתאים?
          </p>

          <button 
            onClick={startGame}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-2xl shadow-lg transition-transform active:scale-95"
          >
            <Play fill="currentColor" />
            {timeLeft === 0 ? "שחק שוב" : "התחל משחק"}
          </button>
        </div>
      ) : (
        // Game Board
        <div className="w-full max-w-md flex flex-col gap-6">
          
          {/* Stats Bar */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-pink-100">
             <div className="flex items-center gap-2 text-pink-600 font-bold text-xl">
               <Trophy size={24} />
               {score}
             </div>
             <div className={`flex items-center gap-2 font-bold text-xl ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
               <Timer size={24} />
               00:{timeLeft.toString().padStart(2, '0')}
             </div>
          </div>

          {/* Target Word (Hebrew) */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-b-8 border-pink-200 min-h-[160px] flex items-center justify-center relative overflow-hidden">
             {/* Progress bar background for timer visual effect could go here */}
             <h3 className="text-5xl font-bold text-slate-800 animate-bounce-short">
               {target?.hebrew}
             </h3>
          </div>

          {/* Options Grid (English) */}
          <div className="grid grid-cols-2 gap-4">
            {options.map((opt, idx) => {
              // Determine button style based on feedback state
              let btnClass = "bg-white hover:bg-pink-50 border-2 border-pink-100 text-slate-700";
              
              if (feedback === 'correct' && opt.english === target?.english) {
                 btnClass = "bg-green-500 text-white border-green-600 scale-105 shadow-green-200";
              } else if (feedback === 'wrong' && opt.english === target?.english) {
                 // Optionally show the correct answer if they got it wrong? 
                 // For now, keep hidden or maybe highlight correct briefly.
              } 
              
              // If user clicked this specific wrong button
              // We'd need to track 'clickedOption' state for that visual. 
              // Keeping it simple for speed: if wrong, just flash screen or shake.

              return (
                <button
                  key={idx + opt.english}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedback !== 'none'}
                  className={`
                    h-24 rounded-xl text-xl font-bold shadow-md transition-all active:scale-95
                    flex items-center justify-center p-2 text-center leading-tight
                    ${btnClass}
                  `}
                >
                  {opt.english}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchMaster;