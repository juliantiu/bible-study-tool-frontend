import { BibleContents, BibleVerse } from "./BibleContents";
import { SearchSettings, SearchType } from "./Searching";
import { DifficultyLevels, MemorizationSettings, MemorizeSession, TimerStateOptions } from "./VerseMemorization";

export enum WindowType {
  none = 0,
  read,
  notes,
  search,
  memorize
}

export enum VerseRecipeFlags {
  oneVerse,
  dashed,
  wholeChapter
}

export interface Window {
  windowId: number;
  windowType: WindowType;
  language: string;
  bibleVersion: string;
  bibleContents: BibleContents | undefined;
}

export interface ReadWindow extends Window {
  bookKey: string;
  bookName: string
  chapterNumber: number;
  verseNumber: number;
}

export interface NotesWindow extends Window {
  bookKey: string;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
}

export interface SearchWindow extends Window {
  rawVerseSearch: string;
  rawKeywordSearch: string;
  verses: BibleVerse[];
  searchSettings: SearchSettings;
  activeSearchType: SearchType;
}

export interface MemorizeWindow extends Window {
  verseList: BibleVerse[];
  difficulty: DifficultyLevels;
  timerState: TimerStateOptions;
  quizSettings: MemorizationSettings;
  currSessionId: string;
  memorizeSessionsHistory: MemorizeSession[];
  currentMemorizeSession: MemorizeSession;
  referenceTimerValues: {
    hh: number;
    mm: number;
    ss: number;
  };
  currentTimerValues: {
    hh: number;
    mm: number;
    ss: number;
  };
  currIdx: number;
  verseHistory: BibleVerse[]; 
}