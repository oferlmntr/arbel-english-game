import React, { useState, useEffect, useRef } from 'react';
import { Play, Car, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { VOCABULARY } from '../constants';
import { speak } from '../services/audioService';

interface SpeedRacerProps {
  onBack: () => void;
}

interface Obstacle {
  id: number;
  lane: 0 | 1 | 2;
  y: number;
  word: string;
  isCorrect: boolean;
  hit?: 'correct' | 'incorrect';
}

const SpeedRacer: React.FC<SpeedRacerProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerLane, setPlayerLane] = useState<0 | 1 | 2>(1); // For UI rendering
  const [displayTarget, setDisplayTarget] = useState(VOCABULARY[0]); // For UI rendering
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  // Mutable state for the game loop
  const gameState = useRef({
    lane: 1 as 0 | 1 | 2,
    score: 0,
    speed: 0.4, 
    lastSpawnTime: 0,
    target: VOCABULARY[0],
    frameId: 0,
    isGameOver: false
  });

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setObstacles([]);
    
    // Reset Game State
    const startWord = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    gameState.current = {
      lane: 1,
      score: 0,
      speed: 0.4,
      lastSpawnTime: Date.now(),
      target: startWord,
      frameId: 0,
      isGameOver: false
    };

    setPlayerLane(1);
    setDisplayTarget(startWord);
    
    cancelAnimationFrame(gameState.current.frameId);
    loop();
  };

  const spawnRow = () => {
    const now = Date.now();
    const newObstacles: Obstacle[] = [];
    
    const lanes = [0, 1, 2] as const;
    const correctLane = lanes[Math.floor(Math.random() * lanes.length)];
    
    newObstacles.push({
      id: now, 
      lane: correctLane,
      y: -80, 
      word: gameState.current.target.english,
      isCorrect: true
    });

    const availableLanes = lanes.filter(l => l !== correctLane);
    const distractorLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

    let wrong = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    let attempts = 0;
    while ((wrong.english === gameState.current.target.english) && attempts < 10) {
      wrong = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
      attempts++;
    }

    newObstacles.push({
      id: now + 1,
      lane: distractorLane,
      y: -80, 
      word: wrong.english,
      isCorrect: false
    });

    setObstacles(prev => [...prev, ...newObstacles]);
  };

  const pickNewTarget = () => {
    const random = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    gameState.current.target = random;
    setDisplayTarget(random);
  };

  const loop = () => {
    if (gameState.current.isGameOver) return;

    const now = Date.now();
    
    // 1. Spawning
    if (now - gameState.current.lastSpawnTime > 3500) {
      spawnRow();
      gameState.current.lastSpawnTime = now;
      gameState.current.speed = Math.min(gameState.current.speed + 0.02, 1.5);
    }

    // 2. Update Obstacles & Collision
    setObstacles(prevObstacles => {
      const carYStart = 380; 
      const carYEnd = 480;   
      
      return prevObstacles
        .map(obs => {
          if (obs.hit) return obs;

          const newY = obs.y + gameState.current.speed;
          let hitType: 'correct' | 'incorrect' | undefined = undefined;

          if (
            obs.lane === gameState.current.lane &&
            newY > carYStart &&
            newY < carYEnd
          ) {
            if (obs.isCorrect) {
              hitType = 'correct';
              speak("Good job!");
              gameState.current.score += 10;
              setScore(gameState.current.score);
              pickNewTarget(); 
            } else {
              hitType = 'incorrect';
              speak("Try again");
              gameState.current.score = Math.max(0, gameState.current.score - 5);
              setScore(gameState.current.score);
            }
          }

          if (hitType) {
            return { ...obs, y: newY, hit: hitType };
          }
          return { ...obs, y: newY };
        })
        .filter(obs => obs.y < 600 && (!obs.hit || obs.hit === 'incorrect')); 
    });
    
    gameState.current.frameId = requestAnimationFrame(loop);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowRight') {
        moveLane('right');
      } else if (e.key === 'ArrowLeft') {
        moveLane('left');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const moveLane = (direction: 'left' | 'right') => {
    if (!isPlaying) return;
    if (direction === 'right') {
        const newLane = Math.min(2, gameState.current.lane + 1) as 0|1|2;
        gameState.current.lane = newLane;
        setPlayerLane(newLane);
    } else {
        const newLane = Math.max(0, gameState.current.lane - 1) as 0|1|2;
        gameState.current.lane = newLane;
        setPlayerLane(newLane);
    }
  };

  const handlePointerDown = (direction: 'left' | 'right', e: React.PointerEvent | React.MouseEvent) => {
    // Prevent default to avoid double-firing on touch devices (touch + simulated click)
    e.preventDefault();
    moveLane(direction);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(gameState.current.frameId);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 select-none">
       <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-3xl font-bold text-orange-600 hidden md:block">מירוץ המילים (Racer)</h2>
        <h2 className="text-2xl font-bold text-orange-600 md:hidden">מירוץ המילים</h2>
         <div className="flex gap-4">
           <div className="text-2xl font-bold">ניקוד: {score}</div>
           <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
             <ArrowLeft size={20}/>
             <span className="hidden md:inline">יציאה</span>
           </button>
        </div>
      </div>

      {!isPlaying ? (
         <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl text-center border-4 border-orange-100 max-w-lg w-full">
          <p className="text-xl mb-4 font-bold">הוראות המשחק:</p>
          <ul className="text-right list-disc list-inside mb-6 space-y-2 text-lg">
            <li>המילה בעברית למעלה.</li>
            <li>סע לנתיב עם המילה באנגלית.</li>
            <li>היזהר! יש נתיב אחד ריק.</li>
          </ul>
          <button 
            onClick={startGame}
            className="flex items-center justify-center w-full gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <Play fill="white" size={28} />
            התחל משחק
          </button>
        </div>
      ) : (
        <div 
          className="relative w-full h-[500px] bg-slate-700 overflow-hidden rounded-xl border-4 border-slate-800 shadow-2xl touch-none"
          style={{ touchAction: 'none' }}
        >
          {/* Road Markings */}
          <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-dashed border-l-2 border-white opacity-30"></div>
          <div className="absolute top-0 bottom-0 right-1/3 w-2 bg-dashed border-l-2 border-white opacity-30"></div>

          {/* Target Word Display */}
          <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
             <div className="bg-orange-500 text-white px-8 py-3 rounded-full border-4 border-white shadow-xl text-3xl font-bold animate-pulse">
               {displayTarget.hebrew}
             </div>
          </div>

          {/* Obstacles */}
          {obstacles.map(obs => (
            <div
              key={obs.id}
              className="absolute w-1/3 flex justify-center items-center transition-none pointer-events-none"
              style={{ 
                top: `${obs.y}px`, 
                left: `${obs.lane * 33.33}%`,
                height: '80px' 
              }}
            >
              <div className={`
                w-10/12 py-3 rounded-xl font-bold text-lg md:text-xl shadow-lg border-b-4 text-center whitespace-nowrap overflow-hidden
                ${obs.hit === 'correct' 
                  ? 'bg-green-500 text-white border-green-700 scale-110' 
                  : obs.hit === 'incorrect' 
                    ? 'bg-red-500 text-white border-red-700 opacity-50' 
                    : 'bg-white text-slate-800 border-slate-300'
                }
                transition-transform duration-100
              `}>
                {obs.word}
              </div>
            </div>
          ))}

          {/* Player Car */}
          <div 
            className="absolute bottom-16 w-1/3 flex justify-center transition-all duration-200 ease-out pointer-events-none"
            style={{ left: `${playerLane * 33.33}%` }}
          >
             <div className="text-orange-400 drop-shadow-2xl filter">
               <Car size={80} fill="#fb923c" strokeWidth={1.5} />
             </div>
          </div>
          
          {/* Touch Controls Overlay - Explicit Zones */}
          <div className="absolute bottom-0 left-0 right-0 h-full z-30 flex">
             <div 
                className="w-1/2 h-full flex items-end pb-4 pl-4 active:bg-white/10 transition-colors cursor-pointer"
                onPointerDown={(e) => handlePointerDown('right', e)}
             >
                <div className="bg-black/20 p-4 rounded-full text-white backdrop-blur-sm pointer-events-none">
                   <ChevronRight size={40} />
                </div>
             </div>
             <div 
                className="w-1/2 h-full flex items-end justify-end pb-4 pr-4 active:bg-white/10 transition-colors cursor-pointer"
                onPointerDown={(e) => handlePointerDown('left', e)}
             >
                <div className="bg-black/20 p-4 rounded-full text-white backdrop-blur-sm pointer-events-none">
                   <ChevronLeft size={40} />
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedRacer;