import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { PublicLanguage } from "../types/BibleContents"; 


interface IGlobalFeaturesConfigurationContext {
  defaultBibleVersion: string;
  assignDefaultBibleVersion: (version: string) => void;
  assignDefaultLanguage: (language: string) => void;
  defaultLanguage: string;
  languageAndBibleVersionList: PublicLanguage[];
}

export const GlobalFeaturesConfigurationContext = createContext<IGlobalFeaturesConfigurationContext>({
  assignDefaultBibleVersion: (version: string) => undefined,
  assignDefaultLanguage: (language: string) => undefined,
  defaultBibleVersion: 'recovery_version',
  defaultLanguage: 'eng',
  languageAndBibleVersionList: []
});

interface GlobalFeaturesConfigurationContextProviderProps {
  children: ReactNode;
}

export function GlobalFeaturesConfigurationContextProvider({ children }: GlobalFeaturesConfigurationContextProviderProps) {
  const [defaultBibleVersion, setDefaultBibleVersion] = useState('recovery_version');
  const [defaultLanguage, setDefaultLanguage] = useState('eng');
  const [languageAndBibleVersionList, setLanguageAndBibleVersionList] = useState([]);

  const assignDefaultBibleVersion = useCallback(
    (version: string) => {
      setDefaultBibleVersion(version);
    },
    [setDefaultBibleVersion]
  );
  
  const assignDefaultLanguage = useCallback(
    (language: string) => {
      setDefaultLanguage(language);
    },
    [setDefaultLanguage]
  );

  useEffect(
    () => {
      const loadLanguagesAndBibleVersions = async () => {
        try {
            const importedFile = await (await fetch(`${process.env.PUBLIC_URL}/bibles/bible_languages_bible_versions.json`,
              { headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
              }
            )).json();
            setLanguageAndBibleVersionList(importedFile);
        } catch (err) {
          console.error(err);
        }
      }

      loadLanguagesAndBibleVersions();
    },
    [setLanguageAndBibleVersionList]
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
        assignDefaultBibleVersion,
        assignDefaultLanguage,
        defaultBibleVersion,
        defaultLanguage,
        languageAndBibleVersionList
      }}
    >
      {children}
    </GlobalFeaturesConfigurationContext.Provider>
  );
}
