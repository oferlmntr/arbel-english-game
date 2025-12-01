import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { VOCABULARY, DIGRAPH_OPTIONS } from '../constants';
import { speak } from '../services/audioService';

interface DigraphGameProps {
  onBack: () => void;
}

const DigraphGame: React.FC<DigraphGameProps> = ({ onBack }) => {
  const digraphWords = VOCABULARY.filter(w => w.digraph);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  
  const currentWord = digraphWords[currentIndex];

  const handleGuess = (digraph: string) => {
    if (feedback !== 'none') return; // block input during feedback

    if (digraph === currentWord.digraph) {
      setFeedback('correct');
      speak(currentWord.english);
      setTimeout(() => {
        setFeedback('none');
        setCurrentIndex((prev) => (prev + 1) % digraphWords.length);
      }, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback('none'), 1000);
    }
  };

  // Create the "masked" word: e.g. "Teacher" -> "Tea__er"
  const getMaskedWord = () => {
    if (!currentWord.digraph) return currentWord.english;
    return currentWord.english.replace(currentWord.digraph, '__');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-purple-600">משחק האותיות (Digraphs)</h2>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
        >
          <ArrowLeft />
          יציאה
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-purple-100">
        <div className="mb-4 text-2xl text-gray-500">{currentWord.hebrew}</div>
        
        <div className="text-6xl font-bold text-slate-800 mb-12 tracking-wider">
          {feedback === 'correct' ? (
            <span className="text-green-600 animate-pulse">{currentWord.english}</span>
          ) : (
            getMaskedWord()
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {DIGRAPH_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleGuess(opt)}
              disabled={feedback !== 'none'}
              className={`
                text-3xl font-bold py-4 rounded-xl shadow-md transition-all
                ${feedback === 'none' ? 'bg-purple-100 hover:bg-purple-200 text-purple-800' : ''}
                ${feedback === 'correct' && opt === currentWord.digraph ? 'bg-green-500 text-white' : ''}
                ${feedback === 'incorrect' && opt !== currentWord.digraph ? 'bg-purple-100 opacity-50' : ''}
                ${feedback === 'incorrect' && opt === currentWord.digraph ? 'bg-purple-100' : ''} 
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-8 h-8">
           {feedback === 'correct' && <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xl"><CheckCircle /> נכון מאוד!</div>}
           {feedback === 'incorrect' && <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-xl"><XCircle /> נסה שוב...</div>}
        </div>
      </div>
    </div>
  );
};

export default DigraphGame;