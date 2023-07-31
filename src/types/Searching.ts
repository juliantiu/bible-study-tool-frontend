export interface SearchSettings {
  verseOrder: SearchSettingsVerseOrder;
  removeDuplicates: boolean;
}

export enum SearchSettingsVerseOrder {
  default = 0,
  ascending,
  descending
}

export enum SearchType {
  verses,
  keywords
}

export interface ConsecutiveVerseTracker {
  book: string;
  firstChapter: number;
  firstVerse: number;
  currentChapter: number;
  currentVerse: number;
  consecutiveCounter: number;
}

export interface SearchDisplayRefTextSettings {
  bolded: boolean;
  fontSize: number;
}

export interface SearchDisplayBothSettings {
  newline: boolean;
  fontColor: string;
}
