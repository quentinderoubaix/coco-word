import type { Letter } from './letter';

// the setup of IndexDB, and the methods to use it.
export function initializeDB(words: string[]) {}

export function searchInDB(searchParams: {
	maxLength?: number;
	searchLetters: { letter: Letter; position: number }[];
}): string[] {
	return [];
}
