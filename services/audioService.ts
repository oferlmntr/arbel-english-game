export const speak = (text: string, lang: 'en-US' | 'he-IL' = 'en-US') => {
  if (!window.speechSynthesis) return;
  
  // Cancel previous speech to avoid queue buildup
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for learning
  utterance.pitch = 1;
  
  window.speechSynthesis.speak(utterance);
};