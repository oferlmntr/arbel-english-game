import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { VOCABULARY } from '../constants';
import { speak } from '../services/audioService';

interface WordShooterProps {
  onBack: () => void;
}

interface Bullet {
  x: number;
  y: number;
  active: boolean;
}

interface FallingWord {
  x: number;
  y: number;
  word: string;
  isCorrect: boolean;
  active: boolean;
  speed: number;
  hitStatus?: 'correct' | 'incorrect';
  hitTime?: number;
}

const WordShooter: React.FC<WordShooterProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState(VOCABULARY[0]);
  
  const gameState = useRef({
    playerX: 300,
    bullets: [] as Bullet[],
    words: [] as FallingWord[],
    score: 0,
    target: VOCABULARY[0],
    lastSpawn: 0,
    gameOver: false,
    frameId: 0
  });

  const pickNewTarget = () => {
    const random = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    setTargetWord(random);
    gameState.current.target = random;
  };

  const startGame = () => {
    setScore(0);
    gameState.current = {
      playerX: 300, // Will be recentered in useEffect
      bullets: [],
      words: [],
      score: 0,
      target: VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)],
      lastSpawn: 0,
      gameOver: false,
      frameId: 0
    };
    setTargetWord(gameState.current.target);
    // Setting isPlaying to true will trigger the useEffect to start the loop
    setIsPlaying(true);
  };

  const spawnWord = (canvasWidth: number) => {
    const isCorrect = Math.random() > 0.5; 
    let wordText = '';
    
    if (isCorrect) {
      wordText = gameState.current.target.english;
    } else {
      let wrong = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
      while (wrong.english === gameState.current.target.english) {
        wrong = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
      }
      wordText = wrong.english;
    }

    gameState.current.words.push({
      x: Math.random() * (canvasWidth - 100) + 50,
      y: -30,
      word: wordText,
      isCorrect: isCorrect,
      active: true,
      // Slow speed: 0.3 to 0.7 pixels per frame
      speed: 0.3 + Math.random() * 0.4 
    });
  };

  const gameLoop = () => {
    if (!canvasRef.current || gameState.current.gameOver) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    // Draw Player
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(gameState.current.playerX, height - 50);
    ctx.lineTo(gameState.current.playerX - 25, height - 10);
    ctx.lineTo(gameState.current.playerX + 25, height - 10);
    ctx.fill();

    // Spawning
    const now = Date.now();
    if (now - gameState.current.lastSpawn > 3000) { 
      spawnWord(width);
      gameState.current.lastSpawn = now;
    }

    // Bullets
    ctx.fillStyle = '#3b82f6';
    gameState.current.bullets.forEach(b => {
      b.y -= 8;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      ctx.fill();
      if (b.y < 0) b.active = false;
    });

    // Words
    ctx.font = 'bold 24px "Varela Round", sans-serif';
    ctx.textAlign = 'center';
    
    gameState.current.words.forEach(w => {
      // Move only if not already hit (hit words pause in place)
      if (!w.hitStatus) {
        w.y += w.speed;
      }
      
      // Handle Hit Animation Duration
      if (w.hitStatus && w.hitTime) {
        if (now - w.hitTime > 1000) {
          w.active = false;
        }
      }

      // Draw Word based on status
      if (w.hitStatus === 'correct') {
        ctx.fillStyle = '#4ade80'; // Green
      } else if (w.hitStatus === 'incorrect') {
        ctx.fillStyle = '#f87171'; // Red
      } else {
        ctx.fillStyle = '#ffffff'; // White
      }
      ctx.fillText(w.word, w.x, w.y);

      // Collision (Only if not already hit)
      if (!w.hitStatus) {
        gameState.current.bullets.forEach(b => {
          if (b.active && w.active) {
            if (Math.abs(b.x - w.x) < 50 && Math.abs(b.y - w.y) < 30) {
              b.active = false;
              
              w.hitTime = Date.now();
              if (w.isCorrect) {
                w.hitStatus = 'correct';
                gameState.current.score += 10;
                setScore(gameState.current.score);
                speak(w.word);
                pickNewTarget();
              } else {
                w.hitStatus = 'incorrect';
                gameState.current.score = Math.max(0, gameState.current.score - 5);
                setScore(gameState.current.score);
                speak("Oh no");
              }
            }
          }
        });
      }

      if (w.y > height) w.active = false;
    });

    gameState.current.bullets = gameState.current.bullets.filter(b => b.active);
    gameState.current.words = gameState.current.words.filter(w => w.active);

    gameState.current.frameId = requestAnimationFrame(gameLoop);
  };

  // Start/Stop Game Loop based on isPlaying state
  useEffect(() => {
    if (isPlaying && canvasRef.current) {
      // Center player when canvas is ready
      gameState.current.playerX = canvasRef.current.width / 2;
      gameLoop();
    }
    return () => cancelAnimationFrame(gameState.current.frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    gameState.current.playerX = e.clientX - rect.left;
  };

  const handleClick = () => {
    if (!isPlaying) return;
    gameState.current.bullets.push({
      x: gameState.current.playerX,
      y: canvasRef.current ? canvasRef.current.height - 50 : 500,
      active: true
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-3xl font-bold text-red-600">מטווח מילים (Shooter)</h2>
        <div className="flex gap-4">
           <div className="text-2xl font-bold">ניקוד: {score}</div>
           <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">יציאה</button>
        </div>
      </div>

      {!isPlaying ? (
        <div className="bg-white p-8 rounded-xl shadow-xl text-center border-4 border-red-100">
          <p className="text-xl mb-4 font-bold">הוראות:</p>
          <p className="mb-6 text-lg">הזז את העכבר כדי לכוון, לחץ כדי לירות על התרגום הנכון!</p>
          <button 
            onClick={startGame}
            className="flex items-center justify-center w-full gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xl"
          >
            <Play fill="white" />
            התחל משחק
          </button>
        </div>
      ) : (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="bg-slate-800 rounded-xl shadow-2xl cursor-crosshair touch-none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleClick}
          />
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <div className="inline-block bg-slate-900/90 text-white text-3xl px-8 py-2 rounded-full border-2 border-red-500 shadow-lg">
               {targetWord.hebrew}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordShooter;