import React from 'react';
import { Volume2, ArrowLeft } from 'lucide-react';
import { VOCABULARY } from '../constants';
import { speak } from '../services/audioService';

interface WordListProps {
  onBack: () => void;
}

const WordList: React.FC<WordListProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-600">רשימת מילים (Word List)</h2>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
        >
          <ArrowLeft />
          חזרה לתפריט
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VOCABULARY.map((word, idx) => (
          <div 
            key={idx} 
            className="bg-white p-4 rounded-xl shadow-md border-2 border-blue-100 flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer"
            onClick={() => speak(word.english)}
          >
            <div>
              <div className="text-xl font-bold text-slate-800">{word.english}</div>
              <div className="text-slate-500">{word.hebrew}</div>
            </div>
            <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
              <Volume2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordList;