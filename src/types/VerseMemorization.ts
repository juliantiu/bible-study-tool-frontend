export interface MemoryVerseWord {
  wordIdx: number;
  missingWord: string;
  attemptedWord: string;
}

export interface MemoryVerse {
  bibleBook: string;
  bookChapter: number;
  chapterVerse: number;
  verseWords: (string | MemoryVerseWord)[];
}

export interface MemorizeSession {
  inputVerses: string;
  memoryVerses: MemoryVerse[];
  memorizeSessionId: string;
}

export const enum DifficultyLevels {
  VerseOnly,
  twentyFive,
  fifty,
  seventyFive,
  oneHundred
}

export const enum TimerStateOptions {
  stop,
  play,
  pause,
  repeat,
  finished
}