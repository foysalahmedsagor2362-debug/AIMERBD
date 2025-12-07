export type StudentTrack = 'HSC-11' | 'HSC-12' | 'Medical' | 'Engineering' | 'University' | null;

export type SubjectDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface SubjectConfig {
  name: string;
  difficulty: SubjectDifficulty;
  weeklyHours: number;
}

export interface StudyBlock {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  type: 'Study' | 'Break' | 'Prayer' | 'Review';
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  category: 'Homework' | 'MCQ' | 'Revision' | 'Reading';
  dueDate: string; // ISO date string
  status: 'Todo' | 'InProgress' | 'Done';
}

export interface Exam {
  id: string;
  name: string;
  date: string;
}

export interface SalatRecord {
  date: string; // YYYY-MM-DD
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface IslamicQuote {
  text: string;
  source: string;
  type: 'Quran' | 'Hadith' | 'Quote';
}

export interface DailyStats {
  date: string;
  pomodoros: number;
  studyBlocksCompleted: number;
}
