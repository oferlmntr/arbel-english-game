import React from 'react';
import { BookOpen, Gamepad2, Brain, Zap, Target, Combine, ScrollText } from 'lucide-react';
import { GameType } from '../types';

interface MainMenuProps {
  onSelectGame: (game: GameType) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  const games = [
    { id: GameType.WORD_LIST, title: 'רשימת מילים', desc: 'ללמוד ולהקשיב למילים', icon: <BookOpen size={32} />, color: 'bg-blue-500' },
    { id: GameType.STORY, title: 'סיפורים', desc: 'השלם את המילה החסרה', icon: <ScrollText size={32} />, color: 'bg-teal-500' },
    { id: GameType.MEMORY, title: 'משחק הזיכרון', desc: 'מצא זוגות תואמים', icon: <Brain size={32} />, color: 'bg-green-500' },
    { id: GameType.DIGRAPHS, title: 'אותיות חסרות', desc: 'השלם את הצירוף (ch, sh...)', icon: <Gamepad2 size={32} />, color: 'bg-purple-500' },
    { id: GameType.SHOOTER, title: 'מטווח מילים', desc: 'פוצץ את המילה הנכונה', icon: <Target size={32} />, color: 'bg-red-500' },
    { id: GameType.RACER, title: 'מירוץ המילים', desc: 'סע לנתיב הנכון', icon: <Zap size={32} />, color: 'bg-orange-500' },
    { id: GameType.MATCH, title: 'התאמה מהירה', desc: 'חבר בין זוגות', icon: <Combine size={32} />, color: 'bg-pink-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-blue-600 mb-2">English Fun</h1>
        <p className="text-xl text-slate-500">ללמוד אנגלית בכיף - כיתה ד'</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`${game.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-4 text-right group`}
          >
            <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-colors">
              {game.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">{game.title}</h3>
              <p className="text-blue-50 opacity-90">{game.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;