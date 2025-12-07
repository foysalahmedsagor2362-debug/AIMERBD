import { IslamicQuote, SubjectConfig } from './types';

export const ISLAMIC_QUOTES: IslamicQuote[] = [
  { text: "My Lord, increase me in knowledge.", source: "Surah Taha 20:114", type: "Quran" },
  { text: "Indeed, with hardship [will be] ease.", source: "Surah Ash-Sharh 94:6", type: "Quran" },
  { text: "He who goes forth in search of knowledge is considered as struggling in the Cause of Allah until he returns.", source: "Tirmidhi", type: "Hadith" },
  { text: "Actions are judged by intentions.", source: "Bukhari", type: "Hadith" },
  { text: "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.", source: "Muslim", type: "Hadith" },
  { text: "Success comes with Sabr and Salah.", source: "Reminder", type: "Quote" },
  { text: "Don't stress, do your best, and leave the rest to Allah.", source: "Reminder", type: "Quote" },
  { text: "Your time is your capital; do not waste it.", source: "Reminder", type: "Quote" }
];

export const HSC_SUBJECTS = [
  "Bangla", "English", "Physics", "Chemistry", "Biology", "Higher Math", "ICT"
];

export const TRACK_SUBJECTS = {
  'Medical': ["Biology", "Chemistry", "Physics", "English", "General Knowledge"],
  'Engineering': ["Math", "Physics", "Chemistry", "English"],
  'University': ["Bangla", "English", "General Knowledge", "Math/IQ"]
};

export const DEFAULT_HSC_CONFIG: SubjectConfig[] = HSC_SUBJECTS.map(s => ({
  name: s,
  difficulty: 'Medium',
  weeklyHours: 5
}));
