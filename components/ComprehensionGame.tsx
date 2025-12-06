import React, { useState, useMemo } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, XCircle, Volume2, ChevronRight, ChevronLeft } from 'lucide-react';
import { READING_PASSAGES } from '../constants';
import { speak } from '../services/audioService';

interface ComprehensionGameProps {
  onBack: () => void;
}

const ComprehensionGame: React.FC<ComprehensionGameProps> = ({ onBack }) => {
  const [passageIndex, setPassageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Calculate maximum possible score
  const maxScore = useMemo(() => {
    return READING_PASSAGES.reduce((total, passage) => total + passage.questions.length, 0) * 10;
  }, []);

  const currentPassage = READING_PASSAGES[passageIndex];
  const currentQuestion = currentPassage.questions[questionIndex];

  const handleOptionSelect = (index: number) => {
    if (isCorrect !== null) return; // Prevent changing answer after submission

    setSelectedOption(index);
    const correct = index === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      speak("Excellent");
      setScore(s => s + 10);
    } else {
      speak("Oh no");
    }

    // Auto advance after short delay
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);

    // If more questions in this passage
    if (questionIndex < currentPassage.questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } 
    // If more passages
    else if (passageIndex < READING_PASSAGES.length - 1) {
      setPassageIndex(prev => prev + 1);
      setQuestionIndex(0);
    } 
    // Game over
    else {
      setShowSummary(true);
    }
  };

  const restartGame = () => {
    setPassageIndex(0);
    setQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowSummary(false);
  };

  if (showSummary) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-4 border-indigo-100 w-full animate-in zoom-in">
          <h2 className="text-4xl font-bold text-indigo-600 mb-6">סיימת את כל הסיפורים!</h2>
          <div className="text-6xl mb-6">🏆</div>
          <p className="text-2xl font-bold text-slate-700 mb-8">
            הניקוד שלך: <span className="text-indigo-600">{score}</span> מתוך <span className="text-slate-500">{maxScore}</span>
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={restartGame}
              className="bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-xl hover:bg-indigo-600 shadow-lg"
            >
              שחק שוב
            </button>
            <button 
              onClick={onBack}
              className="bg-gray-200 text-slate-700 px-8 py-3 rounded-xl font-bold text-xl hover:bg-gray-300"
            >
              חזרה לתפריט
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 flex items-center gap-2">
          <BookOpen />
          הבנת הנקרא
        </h2>
        <div className="flex items-center gap-4">
           <span className="font-bold text-lg bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
             ניקוד: {score}
           </span>
           <button 
            onClick={onBack}
            className="bg-gray-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-300"
          >
            <ArrowLeft size={20} />
            <span className="hidden md:inline">יציאה</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Reading Passage Area - Force LTR for English content */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-indigo-100 text-left" dir="ltr">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-slate-800">{currentPassage.title}</h3>
            <button 
              onClick={() => speak(currentPassage.text)}
              className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
              title="הקרא את הטקסט"
            >
              <Volume2 size={24} />
            </button>
          </div>
          <div className="prose prose-lg text-slate-700 leading-relaxed whitespace-pre-line font-medium text-lg">
            {currentPassage.text}
          </div>
        </div>

        {/* Question Area */}
        <div className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-indigo-100 flex-grow">
            <div className="mb-2 text-sm text-gray-500 font-bold">
              שאלה {questionIndex + 1} מתוך {currentPassage.questions.length}
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-6 text-right" dir="rtl">
              {currentQuestion.question}
            </h4>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, idx) => {
                let btnClass = "bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-300 text-slate-700";
                
                if (selectedOption !== null) {
                  if (idx === currentQuestion.correctAnswer) {
                    btnClass = "bg-green-100 border-green-500 text-green-800 font-bold";
                  } else if (idx === selectedOption) {
                    btnClass = "bg-red-100 border-red-500 text-red-800";
                  } else {
                    btnClass = "opacity-50 border-gray-100";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={selectedOption !== null}
                    className={`p-4 rounded-xl text-right transition-all text-lg ${btnClass}`}
                    dir="rtl"
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedOption !== null && idx === currentQuestion.correctAnswer && <CheckCircle className="text-green-600"/>}
                      {selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="text-red-600"/>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-400 px-2">
            <span>סיפור {passageIndex + 1} מתוך {READING_PASSAGES.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensionGame;