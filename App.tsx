import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import WordList from './components/WordList';
import MemoryGame from './components/MemoryGame';
import DigraphGame from './components/DigraphGame';
import WordShooter from './components/WordShooter';
import SpeedRacer from './components/SpeedRacer';
import MatchMaster from './components/MatchMaster';
import StoryGame from './components/StoryGame';
import { GameType } from './types';

function App() {
  const [activeGame, setActiveGame] = useState<GameType>(GameType.MENU);

  const renderContent = () => {
    switch (activeGame) {
      case GameType.WORD_LIST:
        return <WordList onBack={() => setActiveGame(GameType.MENU)} />;
      case GameType.MEMORY:
        return <MemoryGame onBack={() => setActiveGame(GameType.MENU)} />;
      case GameType.DIGRAPHS:
        return <DigraphGame onBack={() => setActiveGame(GameType.MENU)} />;
      case GameType.SHOOTER:
        return <WordShooter onBack={() => setActiveGame(GameType.MENU)} />;
      case GameType.RACER:
        return <SpeedRacer onBack={() => setActiveGame(GameType.MENU)} />;
      case GameType.MATCH:
        return <MatchMaster onBack={() => setActiveGame(GameType.MENU)} />;
      case GameType.STORY:
        return <StoryGame onBack={() => setActiveGame(GameType.MENU)} />;
      default:
        return <MainMenu onSelectGame={setActiveGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-10">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 pt-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;