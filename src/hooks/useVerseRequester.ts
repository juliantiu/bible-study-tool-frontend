import { useCallback, useEffect, useState } from "react";
import { BibleContents } from "../types/BibleContents";
import { generateBibleBookDirPath } from "../utils/file-systems-util";
import { processTokenizedNumbers } from "../utils/verse-parsing-ustil";
import { BIBLE_BOOK_KEYS } from "../utils/static-references-util";

export default function useVerseRequester(language: string, bibleVersion: string) {
  const [bibleContents, setBibleContents] = useState<BibleContents[]>([]);
  
  useEffect(
    () => {
      language = language ?? 'eng';
      bibleVersion = bibleVersion ?? 'recovery_version';

      const loadBibleData = async () => {
        const contents: BibleContents[] = [];
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
            const data: BibleContents = importedFile[key];
            contents.push(data);
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
      
      const verseRecipes = processTokenizedNumbers(rawVerses);
    },
    []
  );

  return { requestVerses };
}