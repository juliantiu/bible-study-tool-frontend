import { useCallback, useEffect, useState } from "react";
import { BibleContents } from "../types/BibleContents";
import { generateBibleBookDirPath } from "../utils/file-systems-util";
import { normalizeBibleBookName, processRawVerses } from "../utils/verse-parsing-ustil";
import { BIBLE_BOOK_KEYS, BIBLE_BOOK_KEY_MAPPING } from "../utils/static-references-util";
import processVerseRecipes from "../utils/verse-building-util";

export default function useVerseRequester(language: string, bibleVersion: string, existingBibleContents?: BibleContents) {
  const [bibleContents, setBibleContents] = useState<BibleContents>({});
  
  useEffect(
    () => {

      const noExistingBibleContents =
        existingBibleContents === undefined
        || existingBibleContents === null
        || Object.keys(existingBibleContents).length === 0;

      if (!noExistingBibleContents) {
        setBibleContents(existingBibleContents);
        return;
      }

      const languageCopy = language ?? 'eng';
      const bibleVersionCopy = bibleVersion ?? 'recovery_version';

      const loadBibleData = async () => {
        const contents: BibleContents = {};
        for (const key of BIBLE_BOOK_KEYS) {
          try {
            const folder = generateBibleBookDirPath(languageCopy, bibleVersionCopy, key);
            const importedFile = await (await fetch(`${process.env.PUBLIC_URL}/bibles/${folder}`,
              { headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
              }
            )).json();

            contents[key] = importedFile[key];
          } catch (err) {
            console.error(err);
          }
        }
        setBibleContents(contents); 
      }
  
      loadBibleData();
    },
    [bibleVersion, existingBibleContents, language, setBibleContents]
  );

  const requestVerses = useCallback(
    (rawVerses: string) => {
      const verseRecipes = processRawVerses(rawVerses);
      return processVerseRecipes(bibleContents, verseRecipes);
    },
    [bibleContents]
  );

  const requestFullBibleBookName = useCallback(
    (keyword: string) => {
      const [bookName, reference] = keyword.split(' ');

      const normalizedKeyword = normalizeBibleBookName(bookName);
      const key = BIBLE_BOOK_KEY_MAPPING.get(normalizedKeyword);

      if (!key) return keyword;

      const bible = bibleContents[key];
      
      if (!bible && !reference) return keyword;

      return `${bible?.fullName ?? bookName}${!!reference ? ` ${reference}` : ''}`;
    },
    [bibleContents]
  );

  return { bibleContents, requestFullBibleBookName, requestVerses };
}