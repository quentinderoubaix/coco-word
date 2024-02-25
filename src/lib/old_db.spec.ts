/*
import { afterEach, describe, expect, test } from 'vitest';
import { initializeDB, searchInDB, createWordObject } from './db';
import 'fake-indexeddb/auto';

describe('All my DB tests', () => {
  afterEach(() => {
    indexedDB.deleteDatabase('dictionary');
  });

  test('it should return expected word objects', () => {
    const testWords = ['four', 'five', 'love'];

    expect(createWordObject(testWords[0])).toEqual({
      firstLetter: 'f',
      secondLetter: 'o',
      thirdLetter: 'u',
      fourthLetter: 'r'
    });

    expect(createWordObject(testWords[1])).toEqual({
      firstLetter: 'f',
      secondLetter: 'i',
      thirdLetter: 'v',
      fourthLetter: 'e'
    });

    expect(createWordObject(testWords[2])).toEqual({
      firstLetter: 'l',
      secondLetter: 'o',
      thirdLetter: 'v',
      fourthLetter: 'e'
    });
  });

  test('it should return null when words is either too short or too long', () => {
    let testWords: string[] = ['art', 'fourteen'];

    expect(createWordObject(testWords[0])).toBeNull();
    expect(createWordObject(testWords[1])).toBeNull();
  });

  test('it should search by first letter', async () => {
    await initializeDB(['four', 'five', 'love']);
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

  test('it should search by second letter', async () => {
    await initializeDB(['four', 'five', 'love']);
    expect(await searchInDB({ searchLetters: [{ letter: 'o', position: 1 }] })).toEqual([
      'four',
      'love'
    ]);
    expect(await searchInDB({ searchLetters: [{ letter: 'i', position: 1 }] })).toEqual(['five']);
  });

  test('it should search by third letter', async () => {
    await initializeDB(['four', 'five', 'love']);
    expect(await searchInDB({ searchLetters: [{ letter: 'v', position: 2 }] })).toEqual([
      'five',
      'love'
    ]);
    expect(await searchInDB({ searchLetters: [{ letter: 'u', position: 2 }] })).toEqual(['four']);
  });

  test('it should search by fourth letter', async () => {
    await initializeDB(['four', 'five', 'love']);
    expect(await searchInDB({ searchLetters: [{ letter: 'e', position: 3 }] })).toEqual([
      'five',
      'love'
    ]);
    expect(await searchInDB({ searchLetters: [{ letter: 'r', position: 3 }] })).toEqual(['four']);
  });

  test('it should search by first and second letter', async () => {
    await initializeDB(['load', 'loud', 'loose', 'late']);
    expect(
      await searchInDB({
        searchLetters: [
          { letter: 'l', position: 0 },
          { letter: 'o', position: 1 }
        ]
      })
    ).toEqual(['load', 'loud', 'loose']);
  });

  test('it should search by first, second and third letter', async () => {
    await initializeDB(['cough', 'couple', 'could', 'coast']);
    expect(
      await searchInDB({
        searchLetters: [
          { letter: 'c', position: 0 },
          { letter: 'o', position: 1 },
          { letter: 'u', position: 2 }
        ]
      })
    ).toEqual(['cough', 'couple', 'could']);
  });

  test('it should search by second, and third letter', async () => {
    await initializeDB(['rain', 'said', 'bait', 'salt']);
    expect(
      await searchInDB({
        searchLetters: [
          { letter: 'a', position: 1 },
          { letter: 'i', position: 2 }
        ]
      })
    ).toEqual(['rain', 'said', 'bait']);
  });

  test('it should search by third and fourth letter', async () => {
    await initializeDB(['salt']);
    expect(
      await searchInDB({
        searchLetters: [
          { letter: 'i', position: 2 },
          { letter: 'n', position: 3 }
        ]
      })
    ).toEqual(['rain']);
  });
});
*/
