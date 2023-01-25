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
  // if begins with - and followed by :, it's a chapter
  // if begins with ; and followed by :, it's a chapter
  // if begins with ; and followed by ;, it's a chapter
  // if begins with ; and followed by -, it's a chapter
  const pattern = /(?=\s?)\d+\s[A-Za-z]+\.?\s\d+\s?$|(?=\s?)[A-Za-z]+\.?\s\d+\s?$|;\s?\d+$|,\s?\d+$|-\s?\d+$/g
  const res = chapterOrVerseEvaluation(pattern, currentNumber); 
  
  let followingMaybeIsVerse = 
    currentNumber.includes(',') || currentNumber.includes('-');

  if(followingMaybeIsVerse) {
    return res && followingNumber?.includes(':');
  }

  followingMaybeIsVerse = currentNumber.includes(';')

  if (followingMaybeIsVerse) {
    return res && (followingNumber?.includes(':')
                    || followingNumber?.includes(';')
                    || followingNumber?.includes('-')
                    || followingNumber?.includes(',')
                    || followingNumber === undefined);
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
  const VERSE_RECIPE_FLAG_IDX = 3;
  let currentBook = '';
  let currentChapterNumber = 1;

  return tokenizedNumbers?.reduce( 
    (accumulator, item, idx, arr) => { 

      
      if (isChapter(item, arr[idx + 1])) {      
        currentBook = identifyBook(item) ?? currentBook;
        const isOneChap = isOneChapter(currentBook);
        currentChapterNumber = extractNumericalValue(item);

        // Trying to prvent entries like Jude 1; 2; 3; 4
        // Jude is a one chapter book and should not have 4 chapters. 2, 3, and 4 should be ignored.
        // If:
        // (1) Book is one chapter
        // (2) Current contains ; or ,
        // (3) the next item does not have a comma
        // => ignore this item
        // This prevents entries like:
        // (1) Jude 1; 2; 3; 4 ==> which should ignore 2, 3, and 4 because Jude does not have 4 chapters
        // (2) Jude 1, 2; 5:3 ===> which should not replace 1:2 with 1:5 nor 1:3
        if (isOneChap && (item.includes(';') || item.includes(',')) && (arr[idx + 1] === undefined || !(arr[idx + 1].includes(','))))
          return accumulator;

        accumulator.push(
          [currentBook,
            isOneChap ? 1 : currentChapterNumber,
            isOneChap ? currentChapterNumber : undefined, // if one chapter, currentChapterNumber actually represents the verse
            isOneChap ? VerseRecipeFlags.oneVerse
              : item.includes('-')
                ? VerseRecipeFlags.dashed
                : VerseRecipeFlags.wholeChapter]
        );

      } else if (isVerse(item, arr[idx + 1])) {

        const isOneChap = isOneChapter(currentBook);
        const prevAccumulatorIdx = accumulator.length - 1;
        const currentVerse = extractNumericalValue(item);

        // Trying to prevent entries like Phil. 1, 2, 3, 4.
        // Phil 1 should be recorded, but 2, and 3, and 4 should be ignored.
        // Hence, if:
        // (1) not a one chapter book,
        // (2) the current item does not have a :
        // (3) and the next item has a comma or a ; or if current item is the last item in array
        // => ignore this item
        // One chapter books should still work as expected
        //    ex. Jude 1, 2, 3, 4 => Jude 1:1, 1:2, 1:3, 1:4
        if (
          idx > 0
            && !isOneChap
            && (accumulator[accumulator.length - 1][VERSE_RECIPE_FLAG_IDX] === VerseRecipeFlags.wholeChapter)
            && (!item.includes(':'))
            && (idx === arr.length - 1
                || arr[idx + 1]?.includes(',')
                || arr[idx + 1]?.includes(';')))
        {
          return accumulator;
        }

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
              
              // With Jude 1, 2, 5:3, trying to prevent 1:2 from being replaced to 1:3
              if (idx > 0 && !(arr[idx - 1].includes('1'))) {
                return accumulator;
              }

              accumulator[prevAccumulatorIdx][VERSE_RECIPE_VERSE_IDX] =  currentVerse;

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
  const pattern = /((?=;?)\s?\d+\s[A-Za-z]+\.?\s|(?=;?)[A-Za-z]+\.?\s|(?=;?)\s?[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+\s|,\s?|:\s?|\s?-\s?|;?\s?)(\d+)\s?(?!\s?\w{2}\s?)/g;
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