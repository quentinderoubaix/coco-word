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
export function initializeDB(words: string[]) {
  // add wordObject to the database
  const request = indexedDB.open(dbName, 1);

  request.onerror = (event) => {
    // Handle errors.
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
    objectStore.transaction.oncomplete = (event) => {
      const wordObjectStore = db.transaction('words', 'readwrite').objectStore('words');
      words.forEach((word) => {
        const wordObject = createWordObject(word);
        if (wordObject) wordObjectStore.add(wordObject);
      });
    };
  };
}

export function isValidWord(word: string): boolean {
  return false;
}

export function searchInDB(searchParams: {
  maxLength?: number;
  searchLetters: { letter: Letter; position: number }[];
}): string[] {
  let key = mapPositionToKey(searchParams.searchLetters[0].position);

  const request = indexedDB.open(dbName, 1);
  request.onerror = (event) => {
    // Handle errors.
  };

  request.onsuccess = (event) => {
    let db = (event.target as IDBOpenDBRequest)?.result;

    if (!db) return [];

    const wordObjectStore = db.transaction('words', 'readonly').objectStore('words');
    const index = wordObjectStore.index(key);
    let range = IDBKeyRange.only(searchParams.searchLetters[0].letter);

    let cursorRequest = index.openCursor(range);

    cursorRequest.onsuccess = (event) => {
      let cursor = (event.target as IDBRequest)?.result;

      if (cursor) {
        console.log(cursor.value);
        cursor.continue();
      }
    };
  };
  return [];
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
