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

export interface ReadingQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index
}

export interface ReadingPassage {
  id: string;
  title: string;
  text: string;
  questions: ReadingQuestion[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'brawl-stars',
    title: 'Brawl Stars at School',
    text: `My name is Leon. I am in grade 4. I go to school with my friend, Spike. 
    
In the bag, I have a notebook and a pencil. I do not have a book. 
The teacher says: "Leon, where is your homework?" 
I say: "I don't have homework. I have a new game on my phone. It is Brawl Stars!" 
The teacher is not happy.`,
    questions: [
      {
        question: "מי החבר של ליאון?",
        options: ["המורה", "ספייק (Spike)", "דני"],
        correctAnswer: 1
      },
      {
        question: "מה אין לליאון בתיק?",
        options: ["עיפרון (Pencil)", "מחברת (Notebook)", "ספר (Book)"],
        correctAnswer: 2
      },
      {
        question: "מדוע המורה לא שמחה?",
        options: ["כי ליאון משחק בראול סטארס ואין לו שיעורים", "כי ליאון אכל את הארוחה", "כי ליאון איבד את העיפרון"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'stitch',
    title: 'Stitch is Hungry',
    text: `Look at Stitch. Stitch is in the house. He is very hungry.
He goes to the kitchen. He sees a fish. "Yuck!" says Stitch. "I don't like fish."
He sees a notebook. "Yum!" says Stitch. He eats the notebook.
Then, he eats a chair and a math book.
Oh no! Stitch, that is not lunch!`,
    questions: [
      {
        question: "איפה סטיץ' נמצא?",
        options: ["בבית הספר (School)", "בבית (House)", "בחנות (Shop)"],
        correctAnswer: 1
      },
      {
        question: "מה סטיץ' לא רוצה לאכול?",
        options: ["דג (Fish)", "כיסא (Chair)", "ספר (Book)"],
        correctAnswer: 0
      },
      {
        question: "מה סטיץ' אוכל בסוף?",
        options: ["פיצה", "דג", "כיסא וספר חשבון"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'roblox',
    title: 'My Roblox Town',
    text: `I live in a town called Brookhaven in Roblox. It is a new town.
I have a big house. In my house, I have a cool room.
I need to go to the shop. "Let's go," I say to my brother.
In the shop, I buy a new paper and a pencil.
Now I can do my homework in the game!`,
    questions: [
      {
        question: "איך קוראים לעיר בסיפור?",
        options: ["תל אביב", "Brookhaven", "Brawl Town"],
        correctAnswer: 1
      },
      {
        question: "עם מי הוא הולך לחנות?",
        options: ["עם המורה (Teacher)", "עם החבר (Friend)", "עם האח (Brother)"],
        correctAnswer: 2
      },
      {
        question: "מה הוא קונה בחנות?",
        options: ["נייר ועיפרון", "מחשב חדש", "פיצה"],
        correctAnswer: 0
      }
    ]
  }
];