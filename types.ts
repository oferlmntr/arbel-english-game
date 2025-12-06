export interface VocabularyWord {
  english: string;
  hebrew: string;
  digraph?: string; // 'ch', 'sh', 'th', 'wh'
  category?: 'general' | 'school' | 'phrases';
}

export enum GameType {
  MENU = 'MENU',
  WORD_LIST = 'WORD_LIST',
  MEMORY = 'MEMORY',
  DIGRAPHS = 'DIGRAPHS',
  SHOOTER = 'SHOOTER',
  RACER = 'RACER',
  MATCH = 'MATCH',
  STORY = 'STORY',
  COMPREHENSION = 'COMPREHENSION'
}

export interface GameState {
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
}