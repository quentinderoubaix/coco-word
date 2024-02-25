import { describe, expect, test } from 'vitest';
import { addWordToDB, createWordObject, db, searchInDB } from './db';
import 'fake-indexeddb/auto';

describe('All my DB tests', () => {
  test('it should return expected word objects', () => {
    const testWords = ['four', 'five', 'love'];

    expect(createWordObject(testWords[0])).toEqual({
      firstLetter: 'f',
      secondLetter: 'o',
      thirdLetter: 'u',
      fourthLetter: 'r',
      fifthLetter: '',
      sixthLetter: '',
      seventhLetter: ''
    });

    expect(createWordObject(testWords[1])).toEqual({
      firstLetter: 'f',
      secondLetter: 'i',
      thirdLetter: 'v',
      fourthLetter: 'e',
      fifthLetter: '',
      sixthLetter: '',
      seventhLetter: ''
    });

    expect(createWordObject(testWords[2])).toEqual({
      firstLetter: 'l',
      secondLetter: 'o',
      thirdLetter: 'v',
      fourthLetter: 'e',
      fifthLetter: '',
      sixthLetter: '',
      seventhLetter: ''
    });
  });

  test('it should return null when words is either too short or too long', () => {
    let testWords: string[] = ['art', 'fourteen'];

    expect(createWordObject(testWords[0])).toBeNull();
    expect(createWordObject(testWords[1])).toBeNull();
  });

  test('it should search by first letter', async () => {
    await addWordToDB(['four', 'five', 'love']);
    expect(await searchInDB({ searchLetters: [{ letter: 'f', position: 0 }] })).toEqual([
      'four',
      'five'
    ]);
    expect(await searchInDB({ searchLetters: [{ letter: 'v', position: 2 }] })).toEqual([
      'five',
      'love'
    ]);
    expect(await searchInDB({ searchLetters: [{ letter: 'a', position: 0 }] })).toEqual([]);
  });
});
