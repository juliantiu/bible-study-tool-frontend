import { BibleContents, BibleVerse } from "../types/BibleContents";
import { VerseRecipeFlags } from '../types/Windows';

const VERSE_RECIPE_BOOK_IDX = 0;
const VERSE_RECIPE_CHAPTER_IDX = 1;
const VERSE_RECIPE_VERSE_IDX = 2;
const VERSE_RECIPE_FLAGS_IDX = 3;

function processDashedVerseRecipe(
  bibleContents: BibleContents,
  accumulator: BibleVerse[],
  item: (string | number | undefined)[],
  idx: number,
  arr: (string | number | undefined)[][]) 
{

  const accumulatorCopy = [...accumulator];

  const prevVerseRecipe = arr[idx-1];
  const prevVerseRecipeChap = prevVerseRecipe[VERSE_RECIPE_CHAPTER_IDX] as number;
  const prevVerseRecipeVerse = prevVerseRecipe[VERSE_RECIPE_VERSE_IDX] as number;

  const currVerseRecipeBook = item[VERSE_RECIPE_BOOK_IDX] as string;
  const currVerseRecipeChap = item[VERSE_RECIPE_CHAPTER_IDX] as number;
  const currVerseRecipeVerse = item[VERSE_RECIPE_VERSE_IDX] as number;

  if (prevVerseRecipeChap > currVerseRecipeChap) return accumulatorCopy;

  const bibleBookContent = bibleContents[currVerseRecipeBook];
  
  const bibleBookContentPrevVerses = bibleBookContent.contents[prevVerseRecipeChap];
  if (!bibleBookContentPrevVerses) return accumulatorCopy;

  const bibleBookContentCurrVerses = bibleBookContent.contents[currVerseRecipeChap];
  if (!bibleBookContentCurrVerses) return accumulatorCopy;
      
  const bibleBookContentPrevChapVerseCount = Object.keys(bibleBookContentPrevVerses).length;

  if (prevVerseRecipeChap === currVerseRecipeChap) {

    // + 1 because the bibleBookContentPrevVerses[i] has already been handled
    for (let i = prevVerseRecipeVerse + 1; i <= currVerseRecipeVerse && i <=  bibleBookContentPrevChapVerseCount; ++i) {
      
      if (!bibleBookContentPrevVerses[i]) continue;
      accumulatorCopy.push(bibleBookContentPrevVerses[i]);
  
    }
  } else  {

    // + 1 because the bibleBookContentPrevVerses[i] has already been handled
    for (let i = prevVerseRecipeVerse + 1; i <= currVerseRecipeVerse; ++i) {
      
      if (!bibleBookContentPrevVerses[i]) continue;
      accumulatorCopy.push(bibleBookContentPrevVerses[i]);
  
    }

    for (let i = 0; i <= currVerseRecipeVerse; ++i) {
      if (!bibleBookContentCurrVerses[i]) continue;
      accumulatorCopy.push(bibleBookContentCurrVerses[i]);
    }
  }

  return accumulatorCopy;
}

function isDashed(verseRecipeFlag: VerseRecipeFlags) {
  return verseRecipeFlag === VerseRecipeFlags.dashed;
}

function processWholeChapterVerseRecipe(
  bibleContents: BibleContents,
  accumulator: BibleVerse[],
  item: (string | number | undefined)[],
) {
  const accumulatorCopy = [...accumulator];

  const bibleBook = item[VERSE_RECIPE_BOOK_IDX] as string;
  const bookChapter = item[VERSE_RECIPE_CHAPTER_IDX] as number;

  const bibleContentBook = bibleContents[bibleBook];
  if (!bibleContentBook) return accumulatorCopy;
  if (bookChapter > bibleContentBook.chapters) return accumulatorCopy;

  const bibleContentBookChapter = bibleContentBook.contents[bookChapter];
  if (!bibleContentBookChapter) return accumulatorCopy;

  const bibleContentChapterVerseCount = Object.keys(bibleContentBookChapter).length;

  for (let i = 1; i <= bibleContentChapterVerseCount; ++i) {
    accumulatorCopy.push(bibleContentBookChapter[i]);
  }

  return accumulatorCopy;
}

function isWholeChapter(verseRecipeFlag: VerseRecipeFlags) {
  return verseRecipeFlag === VerseRecipeFlags.wholeChapter;
}

function processOneVerseRecipe(
  bibleContents: BibleContents,
  accumulator: BibleVerse[],
  item: (string | number | undefined)[])
{

  const accumulatorCopy = [...accumulator];
  const bibleBook = item[VERSE_RECIPE_BOOK_IDX] as string;
  const bookChapter = item[VERSE_RECIPE_CHAPTER_IDX] as number;
  const chapterVerse = item[VERSE_RECIPE_VERSE_IDX] as number;

  const bibleContentBook = bibleContents[bibleBook];
  if (!bibleContentBook) return accumulatorCopy;
  if (bookChapter > bibleContentBook.chapters) return accumulatorCopy;

  const bibleContentBookChapter = bibleContentBook.contents[bookChapter];
  if (!bibleContentBookChapter) return accumulatorCopy;

  const bibleContentChapterVerse = bibleContentBookChapter[chapterVerse];
  if (!bibleContentChapterVerse) return accumulatorCopy;

  accumulatorCopy.push(bibleContentChapterVerse);

  return accumulatorCopy;
  
}

export default function processVerseRecipes(bibleContents: BibleContents, verseRecipes: (string | number | undefined)[][]): BibleVerse[] {

  return verseRecipes.reduce(
    (accumulator, item, idx, arr) => {
      const verseRecipe = item[VERSE_RECIPE_FLAGS_IDX] as VerseRecipeFlags;
            
      if (isDashed(verseRecipe)) {

        accumulator = processDashedVerseRecipe(
          bibleContents,
          accumulator,
          item,
          idx,
          arr
        );

      } else if (isWholeChapter(verseRecipe)) {

        accumulator = processWholeChapterVerseRecipe(
          bibleContents,
          accumulator,
          item
        );

      } else {

        accumulator = processOneVerseRecipe(
          bibleContents,
          accumulator,
          item
        );

      }

      return accumulator as BibleVerse[];
    },
    [] as BibleVerse[]
  );

}