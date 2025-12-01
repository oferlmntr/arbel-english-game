import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, ScrollText, CheckCircle, Volume2 } from 'lucide-react';
import { STORIES, VOCABULARY, Story } from '../constants';
import { speak } from '../services/audioService';

interface StoryGameProps {
  onBack: () => void;
}

type GapStatus = 'unsolved' | 'english' | 'hebrew';

const StoryGame: React.FC<StoryGameProps> = ({ onBack }) => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentGapIndex, setCurrentGapIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [gapStatuses, setGapStatuses] = useState<GapStatus[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  // Keep track of timeouts to clear them on unmount/reset
  const timeoutRefs = useRef<number[]>([]);

  const initGame = () => {
    // Clear any pending timeouts
    timeoutRefs.current.forEach(window.clearTimeout);
    timeoutRefs.current = [];

    // Pick a random story
    const randomStory = STORIES[Math.floor(Math.random() * STORIES.length)];
    setCurrentStory(randomStory);
    
    // Find all gaps
    const gapsCount = randomStory.parts.filter(p => p.type === 'gap').length;
    setGapStatuses(new Array(gapsCount).fill('unsolved'));
    setCurrentGapIndex(0);
    setIsComplete(false);
  };

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(window.clearTimeout);
    };
  }, []);

  // Generate options when story or gap index changes
  useEffect(() => {
    if (!currentStory || isComplete) return;

    // Find the Nth gap in the parts array
    let gapCount = 0;
    let targetWord = '';
    
    for (const part of currentStory.parts) {
      if (part.type === 'gap') {
        if (gapCount === currentGapIndex) {
          targetWord = part.answer || '';
          break;
        }
        gapCount++;
      }
    }

    if (targetWord) {
      generateOptions(targetWord);
    }
  }, [currentStory, currentGapIndex, isComplete]);

  // Initial load
  useEffect(() => {
    initGame();
  }, []);

  const generateOptions = (correct: string) => {
    // Get 2 random wrong answers
    const wrongOptions = VOCABULARY
      .filter(v => v.english !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(v => v.english);
    
    const allOptions = [...wrongOptions, correct].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const getHebrewForWord = (englishWord: string) => {
    return VOCABULARY.find(v => v.english === englishWord)?.hebrew || englishWord;
  };

  const handleOptionClick = (selected: string) => {
    // Find current correct answer
    let gapCount = 0;
    let correctAnswer = '';
    
    for (const part of currentStory!.parts) {
      if (part.type === 'gap') {
        if (gapCount === currentGapIndex) {
          correctAnswer = part.answer || '';
          break;
        }
        gapCount++;
      }
    }

    if (selected === correctAnswer) {
      // 1. Speak English immediately
      speak(correctAnswer, 'en-US');
      
      // 2. Mark as English
      const newStatuses = [...gapStatuses];
      newStatuses[currentGapIndex] = 'english';
      setGapStatuses(newStatuses);

      // 3. Schedule Hebrew switch
      const gapIndexToFlip = currentGapIndex;
      const hebrewWord = getHebrewForWord(correctAnswer);

      const timeoutId = window.setTimeout(() => {
        if (hebrewWord) {
            speak(hebrewWord, 'he-IL');
        }
        setGapStatuses(prev => {
            if (gapIndexToFlip >= prev.length) return prev;
            const next = [...prev];
            // Only flip if it is currently 'english' (prevents flipping if game reset)
            if (next[gapIndexToFlip] === 'english') {
                next[gapIndexToFlip] = 'hebrew';
            }
            return next;
        });
      }, 2000); // 2 seconds delay
      
      timeoutRefs.current.push(timeoutId);

      // 4. Progress or Finish
      if (currentGapIndex + 1 >= gapStatuses.length) {
        setIsComplete(true);
        // Delay the celebration slightly so it doesn't overlap with the last Hebrew word
        setTimeout(() => speak("Great job! Story complete."), 4000);
      } else {
        setCurrentGapIndex(prev => prev + 1);
      }
    } else {
      setWrongShake(true);
      speak("Try again");
      setTimeout(() => setWrongShake(false), 500);
    }
  };

  if (!currentStory) return null;

  // Helper to render the text with filled gaps
  const renderStoryText = () => {
    let gapCounter = 0;
    return (
      <div className="text-2xl leading-loose text-right" dir="rtl">
        {currentStory.parts.map((part, idx) => {
          if (part.type === 'text') {
            return <span key={idx} className="text-slate-700">{part.value}</span>;
          } else {
            const myGapIndex = gapCounter++;
            const status = gapStatuses[myGapIndex];
            const isCurrent = myGapIndex === currentGapIndex && !isComplete;

            if (status === 'english') {
              return (
                <span key={idx} className="inline-block mx-1 px-2 py-1 bg-green-100 text-green-700 font-bold rounded-lg border border-green-300 transition-all duration-500" dir="ltr">
                  {part.answer}
                </span>
              );
            } else if (status === 'hebrew') {
              return (
                <span key={idx} className="inline-block mx-1 px-2 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-300 transition-all duration-500">
                  {getHebrewForWord(part.answer || '')}
                </span>
              );
            } else if (isCurrent) {
               return (
                <span key={idx} className="inline-block mx-1 px-4 py-1 bg-yellow-100 border-b-4 border-yellow-400 min-w-[80px] text-center rounded animate-pulse">
                  ?
                </span>
               );
            } else {
              return (
                <span key={idx} className="inline-block mx-1 px-4 py-1 border-b-2 border-slate-300 min-w-[60px]">
                  ___
                </span>
              );
            }
          }
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-3xl font-bold text-teal-600 flex items-center gap-3">
          <ScrollText />
          סיפורים (Stories)
        </h2>
        <div className="flex gap-2">
            <button 
              onClick={initGame}
              className="bg-teal-100 text-teal-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-200"
            >
               <RefreshCw size={18} /> סיפור חדש
            </button>
            <button 
              onClick={onBack}
              className="bg-gray-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-300"
            >
              <ArrowLeft size={18} /> יציאה
            </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full border-4 border-teal-50 min-h-[300px]">
        <h3 className="text-2xl font-bold text-center mb-6 text-teal-800 underline decoration-wavy decoration-teal-300">
          {currentStory.title}
        </h3>
        {renderStoryText()}
      </div>

      {/* Controls / Options Area */}
      <div className="mt-8 w-full">
        {isComplete ? (
          <div className="text-center animate-bounce">
            <h3 className="text-4xl font-bold text-teal-600 flex items-center justify-center gap-3">
              <CheckCircle size={40} />
              כל הכבוד! סיימת את הסיפור!
            </h3>
            <button 
              onClick={initGame}
              className="mt-6 px-8 py-3 bg-teal-500 text-white rounded-full text-xl font-bold hover:bg-teal-600 shadow-lg"
            >
              קרא סיפור נוסף
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-xl mb-4 text-slate-500">בחר את המילה החסרה:</p>
            <div className={`grid grid-cols-3 gap-4 w-full max-w-2xl ${wrongShake ? 'animate-shake' : ''}`}>
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="py-4 px-6 bg-white border-2 border-teal-200 text-teal-800 text-xl font-bold rounded-xl shadow-md hover:bg-teal-50 hover:scale-105 hover:border-teal-400 transition-all active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default StoryGame;