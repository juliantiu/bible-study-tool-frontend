export interface BibleContents {
  [bibleBook: string]: BibleBook;
}

export interface BibleBook {
  bibleBook: string;
  category: string;
  chapters: number;
  key: string;
  language: string;
  subcategory: string;
  testament: string;
  version: string;
  contents: BibleBookContents
}

export interface BibleBookContents {
  [chapter: string]: ChapterVerse;
}

export interface ChapterVerse {
  [verse: string]: BibleVerse;
}

export interface BibleVerse {
  bibleBook: string;
  bibleBookKey: string;
  bookChapter: number;
  category: string;
  chapterVerseNumber: number;
  key: string;
  language: string;
  reference: string;
  subcategory: string;
  testament: string;
  text: string;
  version: string;
}
