import React, { useCallback, useEffect, useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { BibleVerse } from '../../../types/BibleContents';
import { DifficultyLevels, MemorizationSettings, MemorizeSession, MemoryVerse, MemoryVerseWord, TimerStateOptions } from '../../../types/VerseMemorization';
import './index.css';

function generateUniqueSetOfVerses(quizSettings: number, verseList: BibleVerse[]) {
  if (!(quizSettings & MemorizationSettings.removeDuplicates)) return [...verseList];

  const verseListCopy = [...verseList];

  return verseListCopy.filter(
    (verse, index, verseList2) => {
      const arrCopy = Array.from(Array(index).keys()).map(i => verseList2[i]);
      const condition = 
        arrCopy.some(v => v.bibleBook === verse.bibleBook
                       && v.bookChapter === verse.bookChapter
                       && v.chapterVerseNumber === verse.chapterVerseNumber)

      if (condition) return false;

      return true;
    }
  );
}

function selectVerse(
  currIdx: number,
  uniqueVerseList: BibleVerse[]
) {
  return uniqueVerseList[currIdx];
}

function generateNumBlanks(
  currentVerse: BibleVerse,
  difficulty: DifficultyLevels,
  uniqueVerseList: BibleVerse[]
) {

  if (!uniqueVerseList || uniqueVerseList.length === 0) return -1;
  if (!currentVerse) return -1;
  if (!currentVerse.text) return -1;

  const tokenizedVerse = currentVerse.text.split(' ');
  const numWords = tokenizedVerse.length;
  let numBlanks = 0;

  switch (difficulty) {
    case DifficultyLevels.VerseOnly:
      break;
    case DifficultyLevels.twentyFive:
      numBlanks = Math.ceil(numWords * .25);
      break;
    case DifficultyLevels.fifty:
      numBlanks = Math.ceil(numWords * .50);
      break;
    case DifficultyLevels.seventyFive:
      numBlanks = Math.ceil(numWords * .75);
      break;
    case DifficultyLevels.oneHundred:
      numBlanks = 1;
      break;
  }

  return numBlanks;
}

function generateMemoryVerseWords(
  currentVerse: BibleVerse,
  numBlanks: number
) {
  if (!currentVerse) return [];
  if (!currentVerse.text) return [];

  const memoryVerseWords: MemoryVerseWord[] = [];
  const chosenIndices: number[] = [];
  const tokenizedVerse = currentVerse.text.split(' ');
  const numWords = tokenizedVerse.length;

  // one blank infers that the difficulty level is set to reference only
  if (numBlanks === 1) {
    memoryVerseWords.push({
      attemptedWord: '',
      missingWord: currentVerse.text,
      wordIdx: 1, // 1 because verse reference will be inserted as index 0
    });

    return memoryVerseWords;
  }

  while (chosenIndices.length < numBlanks) {
    const wordIdx = Math.floor(Math.random() * numWords);

    if (!chosenIndices.includes(wordIdx)) {
      chosenIndices.push(wordIdx);

      memoryVerseWords.push({
        attemptedWord: '',
        missingWord: tokenizedVerse[wordIdx],
        wordIdx: wordIdx + 1, // plus 1 because verse reference will be inserted as index 0
      });
    }
  }

  return memoryVerseWords;
}

function generateVerseStructure(
  currentVerse: BibleVerse,
  memoryVerseWords: MemoryVerseWord[]
) {

  if (!currentVerse) return [];
  if (!currentVerse.text) return [];

  const tokenizedVerse = currentVerse.text.split(' ');
  
  const verseReference =
    `${currentVerse.bibleBook} ${currentVerse.bookChapter}:${currentVerse.chapterVerseNumber}`;
  
  const structure: (string | MemoryVerseWord)[] = [];

  // 0 length infers that difficulty level of verse only was selected
  if (memoryVerseWords.length <= 0) {
    structure.push({
      attemptedWord: '',
      missingWord: verseReference,
      wordIdx: 0
    });
  } else {
    structure.push(verseReference);
  }

  // this checks if difficulty is set to reference only
  if (memoryVerseWords.some(mvw => mvw.wordIdx === 1
                                   && mvw.missingWord
                                     === currentVerse.text))
  {
    structure.push(memoryVerseWords[0]);
    return structure;
  }

  // index starts at 1, because index at 0 will always be the verse reference
  for (let i = 1; i <= tokenizedVerse.length; ++i) {
    if (memoryVerseWords.some(mvw => mvw.wordIdx === i
                                     && mvw.missingWord
                                        === tokenizedVerse[i-1]))
    {
      // ^^ -1 because memory verse word index is +1 its actual index
      
      const memoryVerseWord = memoryVerseWords.find(mvw => mvw.wordIdx === i)!;

      const regPattern = /("?)(\w*)([.,;:!])("?)/;
      const match = memoryVerseWord.missingWord.match(regPattern);

      if (!!match) {

        // matches '"' at the beginning of the missing word
        if (match[0] !== undefined && match[0] === '"') {
          structure.push(match[0]);          
        }
        
        // remove punctuation from the missing word
        const removePunctRegexPatt = /[.,;:!"']/g;
        const missingWordNoPunc = memoryVerseWord.missingWord.replaceAll(removePunctRegexPatt, '');

        const memoryVerseWordFinal: MemoryVerseWord = {...memoryVerseWord, missingWord: missingWordNoPunc };

        structure.push(memoryVerseWordFinal);

        // matches either .,!; at the end or second to last char of the missing word
        if (match[3] !== undefined) {
          structure.push(match[3]);
        } 

        // matches a '"' at the end of the missing word
        if (match[4] !== undefined && match[4] === '"') {
          structure.push(match[4]);
        } 
 
      } else {
        structure.push(memoryVerseWord);
      }
      
    } else {
      structure.push(tokenizedVerse[i-1]);
    }
  }

  return structure;
}

function selectNextIndex(
  quizSettings: number,
  uniqueVerseList: BibleVerse[],
  setCurrIdx: React.Dispatch<React.SetStateAction<number>>,
  verseHistory: BibleVerse[],
  timerState: TimerStateOptions
) {
  if (timerState !== TimerStateOptions.play) return;
  
  const numVerses = uniqueVerseList.length;

  if (!(quizSettings & MemorizationSettings.randomOrder)) {
    setCurrIdx(currIdx => {
      if (currIdx < numVerses-1) return currIdx + 1;
      return 0;
    });

    return;
  } 

  let chosenVerse: BibleVerse;
  let randomIndex = 0;

  do {
    randomIndex = Math.floor(Math.random() * numVerses);

    // All verses have been quizzed over
    if (verseHistory.length >= numVerses) {
      setCurrIdx(randomIndex);
      return;
    }

    chosenVerse = uniqueVerseList[randomIndex];

  } while(
    verseHistory.some(vh =>
      vh.bibleBook === chosenVerse?.bibleBook
      && vh.bookChapter === chosenVerse?.bookChapter
      && vh.chapterVerseNumber === chosenVerse?.chapterVerseNumber
    )
  )

  setCurrIdx(randomIndex);
}

function handleEmptyInputs(allInputs: NodeListOf<Element>) {
  let hasEmptyInput = false;
  for (let i = 0; i < allInputs.length; ++i) {
    const elem = allInputs[i] as any;
    if (!elem.value) {

      elem.style.borderColor = 'red';
      hasEmptyInput = true;

    }
  }
  return hasEmptyInput;
}

function processAnswers(
  allInputs: NodeListOf<Element>,
  verseStructureCopy: (string | MemoryVerseWord)[]
) {
  for (let i = 0; i < allInputs.length; ++i) {
    const elem = allInputs[i] as any;
    const wordIdx = elem.id.split('-')[3];
    const inputValue = elem.value;

    (verseStructureCopy[wordIdx] as MemoryVerseWord)
      .attemptedWord = inputValue;

    elem.value = '';
    elem.style.borderColor = 'rgba(118, 118, 118, 0.3)';
  }

  return verseStructureCopy;
}

interface IMemorizeQuizWindow {
  currIdx: number;
  difficulty: DifficultyLevels;
  quizSettings: number;
  requestFullBibleBookName: (keyword: string) => string;
  setCurrIdx: React.Dispatch<React.SetStateAction<number>>;
  setCurrentMemorizeSession:
    React.Dispatch<React.SetStateAction<MemorizeSession>>;
  setVerseHistory: React.Dispatch<React.SetStateAction<BibleVerse[]>>;
  timerState: TimerStateOptions;
  verseHistory: BibleVerse[];
  verseList: BibleVerse[];
}

export default function MemorizeQuizWindow({
  currIdx,
  difficulty,
  quizSettings,
  requestFullBibleBookName,
  setCurrIdx,
  setCurrentMemorizeSession,
  setVerseHistory,
  timerState,
  verseHistory,
  verseList,
}: IMemorizeQuizWindow) {

  const uniqueVerseList = useMemo(
    () => { return generateUniqueSetOfVerses(quizSettings, verseList) },  
    [quizSettings, verseList]
  );

  const currentVerse = useMemo(
    () => { return selectVerse(currIdx, uniqueVerseList); },
    [currIdx, uniqueVerseList]
  );

  const numBlanks = useMemo(
    () => { return generateNumBlanks(currentVerse, difficulty, uniqueVerseList) },
    [currentVerse, difficulty, uniqueVerseList]
  );

  const memoryVerseWords = useMemo(
    () => { if (verseHistory) {}; return generateMemoryVerseWords(currentVerse, numBlanks) },
    [currentVerse, numBlanks, verseHistory] // include verseHistory as a dependency to encourage new memory verse words generation
  );

  let verseStructure = useMemo(
    () => { 
      return generateVerseStructure(currentVerse, memoryVerseWords);
    },
    [currentVerse, memoryVerseWords]
  );
  
  const onSubmit = useCallback(
    (e: any) => {
      
      e.preventDefault();
      if (e.keyCode !== 13) return;
      if (timerState !== TimerStateOptions.play) return;

      const allInputs =
        document
          .querySelectorAll
            ('[id^=memorize-word-input-]');
      
      // Mark out all empty inputs in red
      const hasEmptyInput =
        handleEmptyInputs(allInputs);

      if (hasEmptyInput) return;

      // Process non-blank input values
      const verseStructureCopy = [...verseStructure]; 
      const verseStructureResult = processAnswers(allInputs, verseStructureCopy);

      // set the current verse 
      setVerseHistory(prev => {
        const prevCopy = [...prev];
        prevCopy.push(currentVerse);
        return prevCopy;
      });

      // See comments below for the reason for temp counter.
      // temp counter is needed only in development
      // for some reason, this problem is not showing up in the build version
      // let tempCounter = 0;

      setCurrentMemorizeSession(
        prev => {
          const prevCopy = {...prev};

          const memoryVerse: MemoryVerse = {
            bibleBook: currentVerse.bibleBook,
            bookChapter: currentVerse.bookChapter,
            chapterVerse: currentVerse.chapterVerseNumber,
            verseWords: verseStructureResult
          }

          // for some reason this triggers twice
          // Hence, check if previous entry is the same verse structure
          // If so, do nothing
          // this is the usage for temp counter
          // if (tempCounter > 0) {
            prevCopy.memoryVerses.push(memoryVerse);
          //   tempCounter = 0;
          // }

          // tempCounter++;

          return prevCopy;
        }
      );

      // selectNextIndex(
      //   quizSettings,
      //   uniqueVerseList,
      //   setCurrIdx,
      //   verseHistory,
      //   timerState
      // );
    },
    [
      currentVerse,
      // quizSettings,
      verseStructure, 
      setCurrentMemorizeSession,
      // setCurrIdx, 
      setVerseHistory, 
      // uniqueVerseList, 
      // verseHistory, 
      timerState
    ]
  );

  useEffect(() => {
    selectNextIndex(
      quizSettings,
      uniqueVerseList,
      setCurrIdx,
      verseHistory,
      timerState
    );
  },
  [  
    quizSettings,
    uniqueVerseList,
    setCurrIdx,
    verseHistory,
    timerState
  ]);

  useEffect(
    () => {
      // every time a session is stopped, clear out all the input fields
      if (timerState === TimerStateOptions.stop) {
        const allInputs =
          document
            .querySelectorAll
              ('[id^=memorize-word-input-]');

        for (const elem of Array.from(allInputs)) {
          (elem as any).value = '';
        }
      }
    },
    [timerState]
  );

  useEffect(
    () => {
      // every time a session is stopped, clear out verse history
      if (timerState === TimerStateOptions.stop) setVerseHistory([]);
    },
    [timerState, setVerseHistory]
  );

  useEffect(
    () => {
      // every time a session is stopped, reset index
      if (timerState === TimerStateOptions.stop) setCurrIdx(0);
    },
    [timerState, setCurrIdx]
  );

  const verseDisplay = verseStructure.map(
    (item, idx) => {
      if (typeof item === 'string') {
        return (
          <p key={`memorize-word-text-${idx}`}
            className={`memorize-quiz-window-verse-p ${idx === 0 ? 'memorize-quiz-window-verse-ref' : ''}`}
          >
            {idx === 0 ? requestFullBibleBookName(item) : item}
          </p>
        );
      } else {
        if (difficulty === DifficultyLevels.oneHundred) {
          return (
            <Form.Control
              key={`memorize-word-input-${idx}`}
              id={`memorize-word-input-${idx}`}
              name={`memorize-word-input-${idx}`}
              as="textarea"
              style={{ height: '80px' }}
              disabled={timerState !== TimerStateOptions.play}
            />
          );
        }
        return (
          <input
            title={`memorize-word-input-${idx}`}
            key={`memorize-word-input-${idx}`}
            id={`memorize-word-input-${idx}`}
            name={`memorize-word-input-${idx}`}
            type="text"
            className={`memorize-quiz-window-verse-input ${idx === 0 ? 'memorize-quiz-window-verse-ref' : ''}`}
            disabled={timerState !== TimerStateOptions.play}
            // e.keyCode 13 is enter. If enter is pressed, prevent browser from refreshing automatically
            onKeyDown={(e: any) => { if (e.keyCode === 13) e.preventDefault(); }}
          />
        );
      }
    }
  );

  return (
    <Row>
      <Col xs={12}>
        <div id="memorize-quiz-window-form-container-primary">
          <div id="memorize-quiz-window-form-container-secondary">
            <Form id="memorize-quiz-window-form" onKeyUp={onSubmit}>
              {verseDisplay}
              <hr />
              <Form.Text>
                Press enter to go on to the next verse.
              </Form.Text>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
}
