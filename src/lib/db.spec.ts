import { describe, expect, test } from 'vitest';
import { initializeDB, searchInDB, createWordObject } from './db';

describe('All my DB tests', () => {
	test('it should return expected word objects', () => {
		let testWords: string[] = ['four', 'five', 'love'];

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

	test('it should search by first letter', () => {
		initializeDB(['four', 'five', 'love']);
		expect(searchInDB({ searchLetters: [{ letter: 'f', position: 0 }] })).toEqual(['four', 'five']);
		expect(searchInDB({ searchLetters: [{ letter: 'v', position: 2 }] })).toEqual(['five', 'love']);
		expect(searchInDB({ searchLetters: [{ letter: 'a', position: 0 }] })).toEqual([]);
	});
});
