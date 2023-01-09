import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import useGlobalFeaturesConfiguration from "../hooks/useGlobalfeaturesConfiguration";

const keys = [
  'GEN',
  'EXOD',
  'LEV',
  'NUM',
  'DEUT',
  'JOSH',
  'JUDG',
  'RUTH',
  '1SAM',
  '2SAM',
  '1KGS',
  '2KGS',
  '1CHR',
  '2CHR',
  'EZRA',
  'NEH',
  'ESTH',
  'JOB',
  'PS',
  'PROV',
  'ECCL',
  'SONG',
  'ISA',
  'JER',
  'LAM',
  'EZEK',
  'DAN',
  'HOS',
  'JOEL',
  'AMOS',
  'OBAD',
  'JONAH',
  'MIC',
  'NAH',
  'HAB',
  'ZEPH',
  'HAG',
  'ZECH',
  'MAL',
  'MATT',
  'MARK',
  'LUKE',
  'JOHN',
  'ACTS',
  'ROM',
  '1COR',
  '2COR',
  'GAL',
  'EPH',
  'PHIL',
  'COL',
  '1THESS',
  '2THESS',
  '1TIM',
  '2TIM',
  'TITUS',
  'PHLM',
  'HEB',
  'JAS',
  '1PET',
  '2PET',
  '1JOHN',
  '2JOHN',
  '3JOHN',
  'JUDE',
  'REV'
];

const searchWordToKey = new Map<string, string>([
   // Old Testament
  ['genesis', 'GEN'],
  ['gen', 'GEN'],

  ['exodus', 'EXOD'],
  ['exo', 'EXOD'],

  ['leviticus', 'LEV'],
  ['numbers', 'NUM'],
  ['deuteronomy', 'DEUT'],
  ['joshua', 'JOSH'],
  ['judges', 'JUDG'],
  ['ruth', 'RUTH'],
  ['1samuel', '1SAM'],
  ['2samuel', '2SAM'],
  ['1kings', '1KGS'],
  ['2kings', '2KGS'],
  ['1chronicles', '1CHR'],
  ['2chronicles', '2CHR'],
  ['ezra', 'EZRA'],
  ['nehemiah', 'NEH'],
  ['esther', 'ESTH'],
  ['job', 'JOB'],
  ['psalms', 'PS'],
  ['proverbs', 'PROV'],
  ['ecclesiastes', 'ECCL'],
  ['songofsongs', 'SONG'],
  ['isaiah', 'ISA'],
  ['jeremiah', 'JER'],
  ['lamentations', 'LAM'],
  ['ezekiel', 'EZEK'],
  ['daniel', 'DAN'],
  ['hosea', 'HOS'],
  ['joel', 'JOEL'],
  ['amos', 'AMOS'],
  ['obadiah', 'OBAD'],
  ['jonah', 'JONAH'],
  ['micah', 'MIC'],
  ['nahum', 'NAH'],
  ['habakkuk', 'HAB'],
  ['zephaniah', 'ZEPH'],
  ['haggai', 'HAG'],
  ['zechariah','ZECH'],
  ['malachi', 'MAL'],
  // New Testament
  ['matthew', 'MATT'],
  ['mark', 'MARK'],
  ['luke', 'LUKE'],
  ['john', 'JOHN'],
  ['acts', 'ACTS'],
  ['romans', 'ROM'],
  ['1corinthians', '1COR'],
  ['2corinthians', '2COR'],
  ['galatians', 'GAL'],
  ['ephesians', 'EPH'],
  ['philippians', 'PHIL'],
  ['colossians', 'COL'],
  ['1thessalonians', '1THESS'],
  ['2thessalonians', '2THESS'],
  ['1timothy', '1TIM'],
  ['2timothy', '2TIM'],
  ['titus', 'TITUS'],
  ['philemon', 'PHLM'],
  ['hebrews', 'HEB'],
  ['james', 'JAS'],
  ['1peter', '1PET'],
  ['2peter', '2PET'],
  ['1john', '1JOHN'],
  ['2john', '2JOHN'],
  ['3john', '3JOHN'],
  ['jude', 'JUDE'],
  ['revelation', 'REV']
 ]);

interface IVerseRequesterContext {
  bibleContentsMapping: Map<string, any>
}

export const VerseRequester = createContext<IVerseRequesterContext>({
  bibleContentsMapping: new Map<string, any>()
});

interface VerseRequesterContextProviderProps {
  children: ReactNode;
}

export function VerseRequesterContextProvider({ children }: VerseRequesterContextProviderProps) {
  const { bibleContents } = useGlobalFeaturesConfiguration();
  const [bibleContentsMapping, setBibleContentsMapping] = useState<Map<string, any>>(new Map<string, any>());

  useEffect(
    () => {
      const tempStore: Map<string, any> = bibleContents.reduce(
        (accumulator, bibleContent) => { 
          accumulator.set(bibleContent.key as any, bibleContent);
          return accumulator;
        },
        new Map<string, any>()
      );
      setBibleContentsMapping(tempStore);
    },
    [bibleContents, setBibleContentsMapping]
  ); 

  const requestVerses = useCallback(
    (verses: string) => {

    },
    []
  );

  return (
    <VerseRequester.Provider
      value={{
        bibleContentsMapping
      }}
    >
      {children}
    </VerseRequester.Provider>
  );
}
