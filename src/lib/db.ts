import Dexie, { type Table } from 'dexie';
import type { Letter } from './types/letter';

const dbName = 'dictionary';
const keyList = [
  'firstLetter',
  'secondLetter',
  'thirdLetter',
  'fourthLetter',
  'fifthLetter',
  'sixthLetter',
  'seventhLetter'
];

export interface Word {
  id?: number;
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  fourthLetter: string;
  fifthLetter: string;
  sixthLetter: string;
  seventhLetter: string;
}

const mapPositionToKey = (position: number) => keyList[position];

const minWordLength = 4;
const maxWordLength = 7;

export class myDexie extends Dexie {
  words!: Table<Word>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      words: `++id, 
              firstLetter, 
              secondLetter, 
              thirdLetter, 
              fourthLetter, 
              fifthLetter, 
              sixthLetter, 
              seventhLetter, 
              [firstLetter+secondLetter], 
              [firstLetter+thirdLetter],
              [firstLetter+fourthLetter],
              [firstLetter+fifthLetter],
              [firstLetter+sixthLetter],
              [firstLetter+seventhLetter],
              [firstLetter+secondLetter+thirdLetter],
              [firstLetter+secondLetter+fourthLetter],
              [firstLetter+secondLetter+fifthLetter],
              [firstLetter+secondLetter+sixthLetter],
              [firstLetter+secondLetter+seventhLetter]`
    });
  }
}

export const db = new myDexie();

export function isWordLengthValid(word: string): boolean {
  return word.length >= minWordLength && word.length <= maxWordLength;
}

export function createWordObject(word: string): Word | null {
  if (isWordLengthValid(word)) {
    let wordObject: Word = {
      firstLetter: '',
      secondLetter: '',
      thirdLetter: '',
      fourthLetter: '',
      fifthLetter: '',
      sixthLetter: '',
      seventhLetter: ''
    };
    wordObject.firstLetter = word[0];
    wordObject.secondLetter = word[1];
    wordObject.thirdLetter = word[2];
    wordObject.fourthLetter = word[3];
    wordObject.fifthLetter = word[4] || '';
    wordObject.sixthLetter = word[5] || '';
    wordObject.seventhLetter = word[6] || '';

    return wordObject;
  }

  return null;
}

export async function addWordToDB(words: string[]) {
  var wordObjects: Word[] = [];
  words.forEach((word) => {
    var wordObject = createWordObject(word);
    if (wordObject) wordObjects.push(wordObject);
  });

  try {
    await db.words.bulkAdd(wordObjects);
  } catch (error) {
    console.error(error);
  }
}

export async function searchInDB(searchParams: {
  maxLength?: number;
  searchLetters: { letter: Letter; position: number }[];
}): Promise<string[]> {
  let indexes = [];
  let values = [];
  for (const searchLetter of searchParams.searchLetters) {
    indexes.push(mapPositionToKey(searchLetter.position));
    values.push(searchLetter.letter);
  }

  let searchResult = await db.words.where(indexes.join('+')).equals(values.join('+')).toArray();

  return searchResult.map((wordObject: Word) => {
    return (
      wordObject.firstLetter +
      wordObject.secondLetter +
      wordObject.thirdLetter +
      wordObject.fourthLetter +
      wordObject.fifthLetter +
      wordObject.sixthLetter +
      wordObject.seventhLetter
    );
  });
}
