import { useCallback, useEffect, useState } from "react";
import { BibleContents } from "../types/BibleContents";
import { generateBibleBookDirPath } from "../utils/file-systems-util";
import { processRawVerses } from "../utils/verse-parsing-ustil";
import { BIBLE_BOOK_KEYS } from "../utils/static-references-util";
import processVerseRecipes from "../utils/verse-building-util";

export default function useVerseRequester(language: string, bibleVersion: string) {
  const [bibleContents, setBibleContents] = useState<BibleContents>({});
  
  useEffect(
    () => {
      language = language ?? 'eng';
      bibleVersion = bibleVersion ?? 'recovery_version';

      const loadBibleData = async () => {
        const contents: BibleContents = {};
        for (const key of BIBLE_BOOK_KEYS) {
          try {
            const folder = generateBibleBookDirPath(language, bibleVersion, key);
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
    [setBibleContents]
  );

  const requestVerses = useCallback(
    (rawVerses: string) => {
      const verseRecipes = processRawVerses(rawVerses);
      return processVerseRecipes(bibleContents, verseRecipes);
    },
    [bibleContents, processRawVerses, processVerseRecipes]
  );

  return { requestVerses };
}