import { VocabularyWord } from './types';

export const VOCABULARY: VocabularyWord[] = [
  // General / Town
  { english: 'friend', hebrew: 'חבר/ה' },
  { english: 'grade', hebrew: 'כיתה/ציון' },
  { english: 'house', hebrew: 'בית' },
  { english: 'new', hebrew: 'חדש' },
  { english: 'school', hebrew: 'בית ספר' },
  { english: 'teacher', hebrew: 'מורה', digraph: 'ch' },
  { english: 'town', hebrew: 'עיירה' },
  { english: 'where do you live?', hebrew: 'איפה אתה גר?' },
  { english: 'I live in...', hebrew: 'אני גר ב...' },
  
  // School Objects
  { english: 'board', hebrew: 'לוח' },
  { english: 'book', hebrew: 'ספר' },
  { english: 'chair', hebrew: 'כיסא', digraph: 'ch' },
  { english: 'eraser', hebrew: 'מחק' },
  { english: 'homework', hebrew: 'שיעורי בית' },
  { english: 'lunch', hebrew: 'ארוחת צהריים', digraph: 'ch' },
  { english: 'need', hebrew: 'צריך' },
  { english: 'notebook', hebrew: 'מחברת' },
  { english: 'paper', hebrew: 'נייר' },
  { english: 'pencil', hebrew: 'עיפרון' },
  { english: 'thanks', hebrew: 'תודה', digraph: 'th' },
  { english: 'do you have..?', hebrew: 'האם יש לך..?' },
  { english: 'i dont have...', hebrew: 'אין לי...' },
  { english: 'let\'s go...', hebrew: 'בוא נלך...' },

  // Phonics / Digraphs specific
  { english: 'math', hebrew: 'חשבון', digraph: 'th' },
  { english: 'brother', hebrew: 'אח', digraph: 'th' },
  { english: 'shop', hebrew: 'חנות', digraph: 'sh' },
  { english: 'fish', hebrew: 'דג', digraph: 'sh' },
  { english: 'English', hebrew: 'אנגלית', digraph: 'sh' },
  { english: 'what', hebrew: 'מה', digraph: 'wh' },
  { english: 'where', hebrew: 'איפה', digraph: 'wh' },
];

export const DIGRAPH_OPTIONS = ['ch', 'sh', 'th', 'wh'];

export interface StoryPart {
  type: 'text' | 'gap';
  value?: string; // For text
  answer?: string; // For gap (english word)
}

export interface Story {
  title: string;
  parts: StoryPart[];
}

export const STORIES: Story[] = [
  {
    title: "יום בבית הספר (School Day)",
    parts: [
      { type: 'text', value: "שלום, קוראים לי דני. בבוקר אני הולך ל" },
      { type: 'gap', answer: 'school' },
      { type: 'text', value: ". שם אני פוגש את ה" },
      { type: 'gap', answer: 'friend' },
      { type: 'text', value: " שלי, טל. המורה שלנו היא " },
      { type: 'gap', answer: 'teacher' },
      { type: 'text', value: " נחמדה מאוד. אני מוציא מהתיק את ה" },
      { type: 'gap', answer: 'notebook' },
      { type: 'text', value: " ואת ה" },
      { type: 'gap', answer: 'pencil' },
      { type: 'text', value: ". אנחנו לומדים " },
      { type: 'gap', answer: 'English' },
      { type: 'text', value: " וחשבון." }
    ]
  },
  {
    title: "בעיר שלי (My Town)",
    parts: [
      { type: 'text', value: "אני גר ב" },
      { type: 'gap', answer: 'town' },
      { type: 'text', value: " קטנה ויפה. זה ה" },
      { type: 'gap', answer: 'house' },
      { type: 'text', value: " שלי. יש לי " },
      { type: 'gap', answer: 'brother' },
      { type: 'text', value: " גדול. אנחנו הולכים ל" },
      { type: 'gap', answer: 'shop' },
      { type: 'text', value: " לקנות אוכל. אולי נקנה " },
      { type: 'gap', answer: 'fish' },
      { type: 'text', value: " לארוחת ערב? כן, אני " },
      { type: 'gap', answer: 'need' },
      { type: 'text', value: " עזרה." }
    ]
  },
  {
    title: "שיעורי בית (Homework)",
    parts: [
      { type: 'text', value: "המורה נתנה לנו " },
      { type: 'gap', answer: 'homework' },
      { type: 'text', value: ". אני יושב על ה" },
      { type: 'gap', answer: 'chair' },
      { type: 'text', value: ". אני צריך " },
      { type: 'gap', answer: 'paper' },
      { type: 'text', value: " ו" },
      { type: 'gap', answer: 'eraser' },
      { type: 'text', value: ". איפה ה" },
      { type: 'gap', answer: 'book' },
      { type: 'text', value: " שלי? הוא על ה" },
      { type: 'gap', answer: 'board' },
      { type: 'text', value: "? לא. הנה הוא! " },
      { type: 'gap', answer: 'thanks' },
      { type: 'text', value: " אמא!" }
    ]
  }
];