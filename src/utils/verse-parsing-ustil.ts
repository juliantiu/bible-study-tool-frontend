import { VerseRecipeFlags } from "../types/Windows";
import { BIBLE_BOOK_KEY_MAPPING, BOOKS_WITH_ONE_CHAPTER } from "./static-references-util";

function extractNumericalValue(currentNumber: string) {
  // strip off book name or punctuiations and just return the number.
  const pattern = /(?!\s?\d+\s[A-Za-z]+\.?\s|[A-Za-z]+\.\s|[A-Za-z]+\s|,\s?|:|\s?-\s?|;\?)(\d+)\s?(?!\s?\w{2}\s?)/g
  const matches = currentNumber.match(pattern);
  return +(matches?.[0] ?? 0);
}

function chapterOrVerseEvaluation(pattern: RegExp, currentNumber: string) {
  const matches = currentNumber.match(pattern);
  return !!matches && matches.length > 0;
}

function isChapter(currentNumber: string, followingNumber?: string) {
  // if begins with alphanumeric, it's a chapter
  // if begins with , and followed by :, it's a chapter
  // if begins with ; and followed by :, it's a chapter
  // if begins with - and followed by :, it's a chapter
  const pattern = /(?=\s?)\d+\s[A-Za-z]+\.?\s\d+\s?$|(?=\s?)[A-Za-z]+\.?\s\d+\s?$|;\s?\d+$|,\s?\d+$|-\s?\d+$/g
  const res = chapterOrVerseEvaluation(pattern, currentNumber); 
  
  const followingIsVerse = 
    currentNumber.includes(',')
      || currentNumber.includes(';')
      || currentNumber.includes('-');

  if(followingIsVerse) {
    return res && followingNumber?.includes(':');
  }

  return res;
}

function isOneChapter(bibleBookKey: string) {
  return BOOKS_WITH_ONE_CHAPTER.includes(bibleBookKey);
}

function isVerse(currentNumber: string, followingNumber?: string) {
  // if has comma, and not followed by :, it's a verse
  // if has -, and not followed by :, it's a verse
  // if has :, then verse
  const pattern = /[,:-]\s?\d+/g;
  return chapterOrVerseEvaluation(pattern, currentNumber)
    && !followingNumber?.includes(':');
}

function identifyBook(bookWithNumber: string) {
  const pattern = /(?=\;?\s?)(\d?\s?[A-Za-z]+\.?|[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+)(?=\s\d+)/g;
  const matches = bookWithNumber.match(pattern);

  if (!!matches) {

    const normalizedBibleBook = matches[0].toLocaleLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, '');
    return BIBLE_BOOK_KEY_MAPPING.get(normalizedBibleBook);
  }

  return matches;
}

function buildVerseRecipes(tokenizedNumbers: string[]) {
  const VERSE_RECIPE_VERSE_IDX = 2; 
  let currentBook = '';
  let currentChapterNumber = 1;

  return tokenizedNumbers?.reduce( 
    (accumulator, item, idx, arr) => { 

      if (isChapter(item, arr[idx + 1])) {

        currentBook = identifyBook(item) ?? currentBook;
        const isOneChap = isOneChapter(currentBook);
        currentChapterNumber = extractNumericalValue(item);

        accumulator.push(
          [currentBook,
            isOneChap ? 1 : currentChapterNumber,
            isOneChap ? currentChapterNumber : undefined,
            isOneChap ? VerseRecipeFlags.oneVerse
              : item.includes('-')
                ? VerseRecipeFlags.dashed
                : VerseRecipeFlags.wholeChapter]
        );

      } else if (isVerse(item, arr[idx + 1])) {

        const isOneChap = isOneChapter(currentBook);
        const prevAccumulatorIdx = accumulator.length - 1;
        const currentVerse = extractNumericalValue(item);

        const isDashedAlready = () => {
          return accumulator[prevAccumulatorIdx][3]
            === VerseRecipeFlags.dashed
            ? VerseRecipeFlags.dashed
            : VerseRecipeFlags.oneVerse
        }

        if (!!accumulator[prevAccumulatorIdx]) { 
          if (
            accumulator[prevAccumulatorIdx][VERSE_RECIPE_VERSE_IDX] === undefined
              || accumulator[prevAccumulatorIdx][VERSE_RECIPE_VERSE_IDX] === null
          ) {
              accumulator[prevAccumulatorIdx] =
                [accumulator[prevAccumulatorIdx][0],
                  accumulator[prevAccumulatorIdx][1],
                  currentVerse,
                  item.includes('-') ? VerseRecipeFlags.dashed : isDashedAlready()];
          } else {

            if (isOneChap && item.includes(':')) {

              accumulator[prevAccumulatorIdx][2] =  currentVerse;

            } else {

              accumulator.push(
                [currentBook,
                  isOneChap ? 1 : currentChapterNumber,
                  currentVerse,
                  item.includes('-') ? VerseRecipeFlags.dashed : VerseRecipeFlags.oneVerse] 
              );

            }
          }
        }
      }

      return accumulator;
    },
    [] as (string | number | undefined)[][]
  ) ?? [];
}

function tokenizeVerseNumericalValues(rawVerses: string) {
  const pattern = /((?=;?)\s?\d+\s[A-Za-z]+\.?\s|(?=;?)[A-Za-z]+\.?\s|(?=;?)\s?[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+\s|,\s?|:\s?|\s?-\s?|;?\s)(\d+)\s?(?!\s?\w{2}\s?)/g;
  const matches = rawVerses.match(pattern);

  return matches;
}

export function processRawVerses(rawVerses: string) {

  const tokenizedVerseNumericalValues =
    tokenizeVerseNumericalValues(rawVerses);

  return buildVerseRecipes(tokenizedVerseNumericalValues as string[]);

}

export function normalizeBibleBookName(keyword: string) {
  return keyword.toLocaleLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, '');
}