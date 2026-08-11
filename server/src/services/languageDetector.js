/**
 * Language Detector & Classifier Service
 * Categorizes input messages into:
 *  - 'hindi'    : Pure Devanagari script text
 *  - 'hinglish' : Roman script Hindi conversational text
 *  - 'english'  : Standard English text
 */

const HINGLISH_KEYWORDS = [
  'kaunsi', 'konsi', 'kaun', 'kaunsa', 'kaisa', 'kaise', 'kaisi',
  'ke liye', 'keliye', 'aur', 'achhi', 'acchi', 'accha', 'achha',
  'bhai', 'batao', 'bataiye', 'kitni', 'kitna', 'kitne', 'chahiye',
  'konsa', 'hai', 'hain', 'mein', 'me', 'paas', 'wala', 'wali',
  'wale', 'se', 'ki', 'ka', 'ko', 'kya', 'kyun', 'kis', 'par',
  'rahega', 'rahegi', 'ho', 'hoga', 'hogi', 'milega', 'milegi',
  'hi', 'bhi', 'to', 'toh', 'ab', 'ya', 'par', 'agar', 'sahi',
  'sabse', 'le', 'lo', 'dono', 'dono me', 'dono mein'
];

const detectLanguage = (text = '') => {
  if (!text || typeof text !== 'string') return 'english';

  const trimmed = text.trim();

  // 1. Check for Devanagari Script Range (U+0900 to U+097F)
  const devanagariPattern = /[\u0900-\u097F]/;
  if (devanagariPattern.test(trimmed)) {
    return 'hindi';
  }

  // 2. Check for Hinglish Vocabulary Markers in Roman Script
  const normalizedLower = trimmed.toLowerCase();
  const words = normalizedLower.split(/\s+/);

  let hinglishScore = 0;
  HINGLISH_KEYWORDS.forEach((keyword) => {
    if (keyword.includes(' ')) {
      if (normalizedLower.includes(keyword)) hinglishScore += 2;
    } else {
      if (words.includes(keyword)) hinglishScore += 1;
    }
  });

  if (hinglishScore >= 1) {
    return 'hinglish';
  }

  return 'english';
};

module.exports = {
  detectLanguage,
  HINGLISH_KEYWORDS
};
