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

const mapPositionToKey = (position: number) => keyList[position];

const minWordLength = 4;
const maxWordLength = 7;

let db: IDBDatabase;

// the setup of IndexDB, and the methods to use it.
export function initializeDB(words: string[]): Promise<void> {
  if (db) {
    db.close();
  }
  // add wordObject to the database
  const request = indexedDB.open(dbName, 2);

  return new Promise((resolve, reject) => {
    request.onerror = (event) => {
      // Handle errors.
      reject(event);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest)?.result;

      if (!db) return;

      // Create an objectStore to hold information about the words.
      const objectStore = db.createObjectStore('words', { autoIncrement: true });

      // Create index for each position in the word and for each combination of positions.
      for (let i = 0; i < maxWordLength; i++) {
        objectStore.createIndex(keyList[i], keyList[i], { unique: false });

        for (let j = i + 1; j < maxWordLength; j++) {
          let indexes = [];

          for (let k = i; k <= j; k++) {
            indexes.push(keyList[k]);
          }

          objectStore.createIndex(indexes.join(', '), indexes, { unique: false });
        }
      }

      // Store values in the newly created objectStore.
      objectStore.transaction.oncomplete = () => {
        const wordObjectStore = db.transaction('words', 'readwrite').objectStore('words');
        words.forEach((word) => {
          const wordObject = createWordObject(word);
          if (wordObject) wordObjectStore.add(wordObject);
        });
      };
    };
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };
  });
}

export async function isValidWord(word: string): Promise<boolean> {
  if (isWordLengthValid(word)) {
    const result = await searchInDB({
      searchLetters: word
        .split('')
        .map((letter, index) => ({ letter: letter as Letter, position: index }))
    });

    if (result.length > 0) {
      return true;
    }
  }
  return false;
}

export function searchInDB(searchParams: {
  maxLength?: number;
  searchLetters: { letter: Letter; position: number }[];
}): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 2);
    db.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest)?.result;

      if (!db) return [];

      const wordObjectStore = db.transaction('words', 'readonly').objectStore('words');
      let indexes = [];
      let values = [];
      for (const searchLetter of searchParams.searchLetters) {
        indexes.push(mapPositionToKey(searchLetter.position));
        values.push(searchLetter.letter);
      }

      const index = wordObjectStore.index(indexes.join(', '));
      const indexRequest = index.getAll(values.length > 1 ? values : values[0]);

      indexRequest.onsuccess = (event) => {
        const wordObjects = (event.target as IDBRequest)?.result;
        db.close();
        resolve(
          wordObjects.map((wordObject: { [x: string]: string }) =>
            keyList
              .map((key) => wordObject[key])
              .filter((val) => val)
              .join('')
          )
        );
      };
    };
  });
}

export function createWordObject(word: string): object | null {
  if (isWordLengthValid(word)) {
    let wordObject: Record<string, string> = {};
    for (let i = 0; i < word.length; i++) {
      wordObject[keyList[i]] = word[i];
    }
    return wordObject;
  }
  return null;
}

export function isWordLengthValid(word: string): boolean {
  return word.length >= minWordLength && word.length <= maxWordLength;
}
