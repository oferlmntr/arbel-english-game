import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { VOCABULARY } from '../constants';
import { speak } from '../services/audioService';

interface MatchMasterProps {
  onBack: () => void;
}

interface Item {
  id: string;
  text: string;
  type: 'english' | 'hebrew';
  matchKey: string;
  matched: boolean;
}

const MatchMaster: React.FC<MatchMasterProps> = ({ onBack }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const initGame = () => {
    // Pick 5 pairs
    const subset = [...VOCABULARY].sort(() => 0.5 - Math.random()).slice(0, 5);
    const newItems: Item[] = [];
    
    subset.forEach((v, idx) => {
      newItems.push({ id: `en-${idx}`, text: v.english, type: 'english', matchKey: v.english, matched: false });
      newItems.push({ id: `he-${idx}`, text: v.hebrew, type: 'hebrew', matchKey: v.english, matched: false });
    });

    setItems(newItems.sort(() => 0.5 - Math.random()));
    setSelectedId(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleItemClick = (item: Item) => {
    if (item.matched) return;
    
    if (item.type === 'english') speak(item.text);

    if (!selectedId) {
      setSelectedId(item.id);
    } else {
      if (selectedId === item.id) {
        setSelectedId(null); // Deselect
        return;
      }

      const prev = items.find(i => i.id === selectedId);
      if (!prev) return;

      if (prev.matchKey === item.matchKey) {
        // Match!
        setItems(curr => curr.map(i => 
          (i.id === item.id || i.id === selectedId) ? { ...i, matched: true } : i
        ));
        setSelectedId(null);
      } else {
        // No match
        setSelectedId(item.id); // Switch selection to new item
      }
    }
  };

  const allMatched = items.length > 0 && items.every(i => i.matched);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-pink-600">התאמה מהירה (Match Master)</h2>
        <div className="flex gap-2">
            <button 
              onClick={initGame}
              className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2"
            >
               <RefreshCw size={18} /> חדש
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map(item => (
           <button
             key={item.id}
             onClick={() => handleItemClick(item)}
             disabled={item.matched}
             className={`
               h-24 rounded-xl text-lg font-bold shadow-md transition-all
               ${item.matched ? 'opacity-0 cursor-default scale-0' : 'opacity-100 scale-100'}
               ${selectedId === item.id ? 'bg-pink-500 text-white ring-4 ring-pink-200' : 'bg-white text-slate-700 hover:bg-pink-50'}
             `}
           >
             {item.text}
           </button>
        ))}
      </div>
      
      {allMatched && (
         <div className="mt-8 text-center">
            <h3 className="text-4xl font-bold text-pink-500 animate-bounce">ניצחון! 🏆</h3>
         </div>
      )}
    </div>
  );
};

export default MatchMaster;