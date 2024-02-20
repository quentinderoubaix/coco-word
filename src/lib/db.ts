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

// the setup of IndexDB, and the methods to use it.
export function initializeDB(words: string[]): Promise<void> {
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

      // Create an index to search words by first letter.
      objectStore.createIndex('firstLetter', 'firstLetter', { unique: false });

      // Create an index to search words by second letter.
      objectStore.createIndex('secondLetter', 'secondLetter', { unique: false });

      // Create an index to search words by third letter.
      objectStore.createIndex('thirdLetter', 'thirdLetter', { unique: false });

      // Create an index to search words by fourth letter.
      objectStore.createIndex('fourthLetter', 'fourthLetter', { unique: false });

      // Create an index to search words by fifth letter.
      objectStore.createIndex('fifthLetter', 'fifthLetter', { unique: false });

      // Create an index to search words by sixth letter.
      objectStore.createIndex('sixthLetter', 'sixthLetter', { unique: false });

      // Create an index to search words by seventh letter.
      objectStore.createIndex('seventhLetter', 'seventhLetter', { unique: false });

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
      resolve();
    };
  });
}

export function isValidWord(word: string): boolean {
  return false;
}

export function searchInDB(searchParams: {
  maxLength?: number;
  searchLetters: { letter: Letter; position: number }[];
}): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const key = mapPositionToKey(searchParams.searchLetters[0].position);

    const request = indexedDB.open(dbName, 2);
    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest)?.result;

      if (!db) return [];

      const wordObjectStore = db.transaction('words', 'readonly').objectStore('words');
      const index = wordObjectStore.index(key);
      const indexRequest = index.getAll(searchParams.searchLetters[0].letter);

      indexRequest.onsuccess = (event) => {
        const wordObjects = (event.target as IDBRequest)?.result;
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

export function createWordObject(word: string): any {
  if (word.length >= 4 && word.length <= 7) {
    let wordObject: Record<string, string> = {};
    for (let i = 0; i < word.length; i++) {
      wordObject[keyList[i]] = word[i];
    }
    return wordObject;
  }
  return null;
}
