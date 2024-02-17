import { describe, expect, test } from 'vitest';
import { initializeDB, searchInDB } from './db';

describe('All my DB tests', () => {
	test('it should search by first letter', () => {
		initializeDB(['four', 'five', 'love']);
		expect(searchInDB({ searchLetters: [{ letter: 'f', position: 0 }] })).toEqual(['four', 'five']);
		expect(searchInDB({ searchLetters: [{ letter: 'v', position: 2 }] })).toEqual(['five', 'love']);
		expect(searchInDB({ searchLetters: [{ letter: 'a', position: 0 }] })).toEqual([]);
	});
});
