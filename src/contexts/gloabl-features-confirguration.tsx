import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { BibleContents } from '../types/BibleContents';
import { generateBibleBookDirPath } from "../utils/file-systems-util";

const bibleBooks = [
  ['Genesis', 'GEN',],
  ['Exodus', 'EXOD'],
  ['Leviticus', 'LEV'],
  ['Numbers', 'NUM'],
  ['Deuteronomy', 'DEUT'],
  ['Joshua', 'JOSH'],
  ['Judges', 'JUDG'],
  ['Ruth', 'RUTH'],
  ['1Samuel', '1SAM'],
  ['2Samuel', '2SAM'],
  ['1Kings', '1KGS'],
  ['2Kings', '2KGS'],
  ['1Chronicles', '1CHR'],
  ['2Chronicles', '2CHR'],
  ['Ezra', 'EZRA'],
  ['Nehemiah', 'NEH'],
  ['Esther', 'ESTH'],
  ['Job', 'JOB'],
  ['Psalms', 'PS'],
  ['Proverbs', 'PROV'],
  ['Ecclesiastes', 'ECCL'],
  ['SongofSongs', 'SONG'],
  ['Isaiah', 'ISA',],
  ['Jeremiah', 'JER'],
  ['Lamentations', 'LAM'],
  ['Ezekiel', 'EZEK'],
  ['Daniel', 'DAN'],
  ['Hosea', 'HOS'],
  ['Joel', 'JOEL'],
  ['Amos', 'AMOS'],
  ['Obadiah', 'OBAD'],
  ['Jonah', 'JONAH'],
  ['Micah', 'MIC'],
  ['Nahum', 'NAH'],
  ['Habakkuk', 'HAB'],
  ['Zephaniah', 'ZEPH'],
  ['Haggai', 'HAG'],
  ['Zechariah', 'ZECH'],
  ['Malachi', 'MAL'],
  ['Matthew', 'MATT',],
  ['Mark', 'MARK',],
  ['Luke', 'LUKE',],
  ['John', 'JOHN',],
  ['Acts', 'ACTS'],
  ['Romans', 'ROM'],
  ['1Corinthians', '1COR'],
  ['2Corinthians', '2COR'],
  ['Galatians', 'GAL'],
  ['Ephesians', 'EPH'],
  ['Philippians', 'PHIL'],
  ['Colossians', 'COL'],
  ['1Thessalonians', '1THESS'],
  ['2Thessalonians', '2THESS'],
  ['1Timothy', '1TIM'],
  ['2Timothy', '2TIM'],
  ['Titus', 'TITUS'],
  ['Philemon', 'PHLM'],
  ['Hebrews', 'HEB'],
  ['James', 'JAS'],
  ['1Peter', '1PET'],
  ['2Peter', '2PET'],
  ['1John', '1JOHN'],
  ['2John', '2JOHN'],
  ['3John', '3JOHN'],
  ['Jude', 'JUDE'],
  ['Revelation', 'REV'],
]

interface IGlobalFeaturesConfigurationContext {
  bibleVersion: string;
  assignBibleVersion: (version: string) => void;
  assignLanguage: (language: string) => void;
  language: string;
}

export const GlobalFeaturesConfigurationContext = createContext<IGlobalFeaturesConfigurationContext>({
  bibleVersion: 'Recovery Version',
  assignBibleVersion: (version: string) => undefined,
  assignLanguage: (language: string) => undefined,
  language: 'eng',
});

interface GlobalFeaturesConfigurationContextProviderProps {
  children: ReactNode;
}

export function GlobalFeaturesConfigurationContextProvider({ children }: GlobalFeaturesConfigurationContextProviderProps) {
  const [bibleVersion, setBibleVersion] = useState('Recovery Version');
  const [language, setLanguage] = useState('eng');

  const assignBibleVersion = useCallback(
    (version: string) => {
      setBibleVersion(version);
    },
    [setBibleVersion]
  );
  
  const assignLanguage = useCallback(
    (language: string) => {
      setLanguage(language);
    },
    [setLanguage]
  );

  // useEffect(
  //   () => {
  //     const loadBibleData = async () => {
  //       const contents: BibleContents[] = [];
  //       for (const [, key] of bibleBooks) {
  //         try {
  //           const folder = generateBibleBookDirPath(language, bibleVersion, key);
  //           const importedFile = await (await fetch(`${process.env.PUBLIC_URL}/bibles/${folder}`,
  //             { headers : { 
  //               'Content-Type': 'application/json',
  //               'Accept': 'application/json'
  //               }
  //             }
  //           )).json();
  //           const data: BibleContents = importedFile[key];
  //           contents.push(data);
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       }
  //       setBibleContents(contents); 
  //     }

  //     loadBibleData();
  //   },
  //   [bibleVersion, language]
  // );

  return (
    <GlobalFeaturesConfigurationContext.Provider
      value={{
        assignBibleVersion,
        assignLanguage,
        bibleVersion,
        language,
      }}
    >
      {children}
    </GlobalFeaturesConfigurationContext.Provider>
  );
}
