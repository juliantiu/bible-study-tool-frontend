import { BibleVerse } from "./BibleContents";

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
  rawSearch: string;
  verses: BibleVerse[];
}

export interface MemorizeWindow extends Window {
  rawSearch: string;
  verses: BibleVerse[];
}