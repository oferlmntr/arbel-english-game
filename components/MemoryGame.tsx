import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { VOCABULARY } from '../constants';
import { speak } from '../services/audioService';
import { VocabularyWord } from '../types';

interface MemoryCard {
  id: number;
  word: string;
  type: 'english' | 'hebrew';
  matchId: string; // The english word is the unique key
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onBack: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  const initializeGame = () => {
    // Pick 8 random pairs
    const shuffledVocab = [...VOCABULARY].sort(() => 0.5 - Math.random()).slice(0, 8);
    
    const gameCards: MemoryCard[] = [];
    shuffledVocab.forEach((vocab, index) => {
      // English Card
      gameCards.push({
        id: index * 2,
        word: vocab.english,
        type: 'english',
        matchId: vocab.english,
        isFlipped: false,
        isMatched: false
      });
      // Hebrew Card
      gameCards.push({
        id: index * 2 + 1,
        word: vocab.hebrew,
        type: 'hebrew',
        matchId: vocab.english,
        isFlipped: false,
        isMatched: false
      });
    });

    setCards(gameCards.sort(() => 0.5 - Math.random()));
    setFlippedIndices([]);
    setMatches(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index: number) => {
    // Prevent clicking if already matched, flipped, or if 2 cards are already flipped
    if (cards[index].isMatched || cards[index].isFlipped || flippedIndices.length >= 2) return;

    // Speak if english
    if (cards[index].type === 'english') {
      speak(cards[index].word);
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const idx1 = newFlipped[0];
      const idx2 = newFlipped[1];

      if (cards[idx1].matchId === cards[idx2].matchId) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            i === idx1 || i === idx2 ? { ...c, isMatched: true, isFlipped: true } : c
          ));
          setFlippedIndices([]);
          setMatches(m => m + 1);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            i === idx1 || i === idx2 ? { ...c, isFlipped: false } : c
          ));
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-green-600">משחק הזיכרון (Memory)</h2>
        <div className="flex gap-2">
           <button 
            onClick={initializeGame}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-bold"
          >
            <RefreshCw size={20} />
            ערבב מחדש
          </button>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
          >
            <ArrowLeft />
            יציאה
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`
              h-32 rounded-xl flex items-center justify-center text-center p-2 cursor-pointer transition-all duration-300 transform
              ${card.isFlipped || card.isMatched ? 'rotate-y-180 bg-white border-2 border-green-400' : 'bg-green-500 hover:bg-green-600'}
              shadow-lg
            `}
          >
            {(card.isFlipped || card.isMatched) ? (
              <span className="text-lg font-bold select-none text-slate-800">
                {card.word}
              </span>
            ) : (
              <span className="text-4xl text-white opacity-50">?</span>
            )}
          </div>
        ))}
      </div>
      {matches === 8 && (
        <div className="mt-8 text-center animate-bounce">
          <h3 className="text-4xl font-bold text-green-600">כל הכבוד! סיימת את המשחק! 🎉</h3>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;