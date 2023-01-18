import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { BibleVerse } from '../../../types/BibleContents';
import { DifficultyLevels, MemorizeSession, MemoryVerse, MemoryVerseWord, TimerStateOptions } from '../../../types/VerseMemorization';
import './index.css';

function generateUniqueSetOfVerses(verseList: BibleVerse[]) {
  return [verseList[0], ...verseList.reduce(
    (acc, item, idx, arr) => {
      for(let i = 0; i <= idx; ++i) {
        if (arr[i].bibleBook === item.bibleBook
            && arr[i].bookChapter === item.bookChapter
            && arr[i].chapterVerseNumber === item.chapterVerseNumber) continue;

        acc.push(item);
      }

      return acc as BibleVerse[];
    },
    [] as BibleVerse[]
  )];
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
      // -1 because memory verse word index is +1 its actual index
      structure.push(memoryVerseWords.find(mvw => mvw.wordIdx === i)!);
    } else {
      structure.push(tokenizedVerse[i-1]);
    }
  }

  return structure;
}

function selectNextIndex(
  uniqueVerseList: BibleVerse[],
  setCurrIdx: React.Dispatch<React.SetStateAction<number>>,
  verseHistory: BibleVerse[],
  timerState: TimerStateOptions
) {
  if (timerState !== TimerStateOptions.play) return;

  const numVerses = uniqueVerseList.length;
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
      vh.bibleBook === chosenVerse.bibleBook
      && vh.bookChapter === chosenVerse.bookChapter
      && vh.chapterVerseNumber === chosenVerse.chapterVerseNumber
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
  }

  return verseStructureCopy;
}

interface IMemorizeQuizWindow {
  setCurrentMemorizeSession:
    React.Dispatch<React.SetStateAction<MemorizeSession>>,
  difficulty: DifficultyLevels;
  timerState: TimerStateOptions;
  verseList: BibleVerse[];
}

export default function MemorizeQuizWindow({
  difficulty,
  setCurrentMemorizeSession,
  timerState,
  verseList,
}: IMemorizeQuizWindow) {

  const [currIdx, setCurrIdx] = useState(0);
  const [verseHistory, setVerseHistory] = useState<BibleVerse[]>([]);

  const uniqueVerseList = useMemo(
    () => { return generateUniqueSetOfVerses(verseList) },  
    [verseList]
  );

  const currentVerse = useMemo(
    () => { return selectVerse(currIdx, uniqueVerseList); },
    [currIdx, setVerseHistory, uniqueVerseList]
  );

  const numBlanks = useMemo(
    () => { return generateNumBlanks(currentVerse, difficulty, uniqueVerseList) },
    [currentVerse, difficulty, uniqueVerseList]
  );

  const memoryVerseWords = useMemo(
    () => { return generateMemoryVerseWords(currentVerse, numBlanks) },
    [currentVerse, numBlanks]
  );

  let verseStructure = useMemo(
    () => { return generateVerseStructure(currentVerse, memoryVerseWords) },
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
      verseStructure = processAnswers(allInputs, verseStructureCopy);

      // set the current verse 
      setVerseHistory(prev => {
        prev.push(currentVerse);
        return prev;
      });

      setCurrentMemorizeSession(
        prev => {
          const memoryVerse: MemoryVerse = {
            bibleBook: currentVerse.bibleBook,
            bookChapter: currentVerse.bookChapter,
            chapterVerse: currentVerse.chapterVerseNumber,
            verseWords: verseStructure
          }
          prev.memoryVerses.push(memoryVerse);
          return prev;
        }
      );

      selectNextIndex(
        uniqueVerseList,
        setCurrIdx,
        verseHistory,
        timerState
      );
    },
    [
      currentVerse,
      verseStructure, 
      uniqueVerseList, 
      setCurrIdx, 
      setVerseHistory, 
      verseHistory, 
      timerState
    ]
  );

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

  const verseDisplay = verseStructure.map(
    (item, idx) => {
      if (typeof item === 'string') {
        return (
          <p key={`memorize-word-text-${idx}`}
            className={`memorize-quiz-window-verse-p ${idx === 0 ? 'memorize-quiz-window-verse-ref' : ''}`}
          >
            {item}
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
