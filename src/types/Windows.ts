import { BibleVerse } from "./BibleContents";

export interface Window { }

export interface ReadWindow extends Window {
    book: string;
    chapter: number;
    verse: number;
}

export interface NotesWindow extends Window {
  book: string;
  chapter: number;
  verse: number;
}

export interface SearchWindow extends Window {
  rawSearch: string;
  verses: BibleVerse[];
}

export interface MemorizeWindow extends Window {
  rawSearch: string;
  verses: BibleVerse[];
}