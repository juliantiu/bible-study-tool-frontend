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
  // if begins with - and the previous is a whole chapter, it's a chapter
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

  followingMaybeIsVerse = currentNumber.includes(';');

  if (followingMaybeIsVerse) {

    // This checks if the following item contains a book name
    const r = new RegExp(/((?=;?\s?)\d+\s[A-Za-z]+\.?\s|(?=;?\s?)[A-Za-z]+\.?\s|(?=;?\s?)[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+\s)/g);

    return res && (r?.test(followingNumber ?? '')
                    || followingNumber?.includes(':')
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
  const pattern = /[,:-]\s*\d+/g;
  return (chapterOrVerseEvaluation(pattern, currentNumber)
      && !followingNumber?.includes(':'))
    || currentNumber.includes(':');
}

function identifyBook(bookWithNumber: string) {
  const pattern = /(?=;?\s?)(\d?\s?[A-Za-z]+\.?|[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+)(?=\s\d+)/g;
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
  let currentBook: string | undefined | null = '';
  let currentChapterNumber = 1;
  let oneChapVerse = 0;

  return tokenizedNumbers?.reduce( 
    (accumulator, item, idx, arr) => {

      if (isChapter(item, arr[idx + 1])) {
              
        const identifiedBook = identifyBook(item);

        if (!!identifiedBook) currentBook = identifiedBook;

        if (identifiedBook === undefined)
          currentBook = '';

        const isOneChap = isOneChapter(currentBook!);
        currentChapterNumber = extractNumericalValue(item);

        if (isOneChap) {

          // (TASK) Trying to prevent entries that have chapters > 1, like Jude 1, 2, 3, 4:5 ==> should ignore 4:5
          if (currentChapterNumber > 1 && (arr[idx + 1]?.includes(':') || item.includes(';'))) {

            oneChapVerse = 0;

          } else {

            oneChapVerse = currentChapterNumber;
            currentChapterNumber = 1;


            if (currentChapterNumber >= 1 && (arr[idx + 1] === undefined || arr[idx + 1]?.includes(','))) {

              accumulator.push(
                [currentBook!,
                  currentChapterNumber,
                  oneChapVerse, 
                  VerseRecipeFlags.oneVerse]);

              return accumulator;

            } else if (currentChapterNumber >= 1 && arr[idx + 1]?.includes('-')) {
              
              accumulator.push(
                [currentBook!,
                  currentChapterNumber,
                  oneChapVerse, 
                  VerseRecipeFlags.oneVerse]);

            }

          }
          // END (TASK)

        } else {

          oneChapVerse = 0;

        }

        accumulator.push(
          [currentBook!,
            currentChapterNumber,
            undefined,
            isOneChap ? VerseRecipeFlags.oneVerse
              : item.includes('-')
                ? VerseRecipeFlags.dashed
                : VerseRecipeFlags.wholeChapter]
        );

      } else if (isVerse(item, arr[idx + 1])) {

        const isOneChap = isOneChapter(currentBook!);
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

          // In John 1-3, the -3 is interpreted as a verse.
          // It should be a chapter with a dashed flag.
          // Hence, if:
          // (1) criteria from above comments apply
          // (2) the current item includes a -
          // => push a new entry to accumulator with the current "verse" as the chapter and dashed as flag
          if (item.includes('-')) {

            accumulator.push(
              [currentBook!,
              currentVerse,
              undefined,
              VerseRecipeFlags.dashed
            ]);
            
            return accumulator;

          }

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

            
            if (isOneChap && oneChapVerse < 1) {

              return accumulator;

            } else if (isOneChap && item.includes(':')) {

              if (accumulator[prevAccumulatorIdx][VERSE_RECIPE_VERSE_IDX] === undefined) {

                accumulator[prevAccumulatorIdx][VERSE_RECIPE_VERSE_IDX] = currentVerse;

              } 

            } else {

              accumulator.push(
                [currentBook!,
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
  const pattern = /((?=;?)\s?\d+\s[A-Za-z]+\.?\s|(?=;?)[A-Za-z]+\.?\s|(?=;?)\s?[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+\s|,\s*|:\s*|\s*-\s*|;?\s*)(\d+)\s?(?!\s?\w{2}\s?)/g;
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