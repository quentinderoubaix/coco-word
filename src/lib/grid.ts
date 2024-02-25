import { batch, computed, writable, type WritableSignal } from '@amadeus-it-group/tansu';
import type { Letter } from './types/letter';
import { isValidWord } from './db';
import type { Direction } from './types/direction';

export const grid = writable([] as Cell[][]);
export const editableWords = writable([] as EditableWord[]);
export const useableForNewEditable = writable([] as Cell[]);
export const selectedEditable = writable(undefined as undefined | EditableWord);

function reset() {
  batch(() => {
    editableWords.set([]);
    useableForNewEditable.set([]);
    selectedEditable.set(undefined);
  });
}

class Cell {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}
  public readonly letter: WritableSignal<undefined | Letter> = writable(undefined);
  public wasSetUsingDirection: Direction = 'horizontal';
  public readonly tempLetter: WritableSignal<undefined | Letter> = writable(undefined);
  public readonly editable: WritableSignal<boolean> = writable(false);
  public neighboors: [
    [left: Cell | undefined, right: Cell | undefined],
    [top: Cell | undefined, bottom: Cell | undefined]
  ] = [
    [undefined, undefined],
    [undefined, undefined]
  ];
}

class EditableWord {
  constructor(
    public readonly cells: Cell[],
    public readonly direction: Direction
  ) {}
  public readonly isValid = computed(() => {
    const letters: Letter[] = [];
    let allFilled = true;
    for (const cell of this.cells) {
      const letter = cell.letter();
      const tempLetter = cell.tempLetter();
      if (letter) {
        letters.push(letter);
      } else if (tempLetter) {
        letters.push(tempLetter);
      } else {
        allFilled = false;
      }
    }
    if (!allFilled) {
      return allFilled;
    } else {
      return isValidWord(letters.join(''));
    }
  });
}

interface EditableSpot {
  direction: Direction;
  from: number;
  to: number;
  cell: Cell;
  nbLetters: number;
}

function canCreateEditable(cell: Cell): false | EditableSpot {
  if (!cell.letter()) {
    return false;
  }
  if (cell.wasSetUsingDirection === 'horizontal') {
    if (cell.neighboors[1][0]?.letter() || cell.neighboors[1][1]?.letter()) {
      return false;
    }
    let nbLetters = 1;
    let from = 0;
    let walkCell = cell;
    while (
      from >= -5 &&
      walkCell.neighboors[1][0] &&
      !walkCell.neighboors[1][0].neighboors[1][0]?.letter() &&
      !walkCell.neighboors[1][0].neighboors[0][0]?.letter() &&
      !walkCell.neighboors[1][0].neighboors[0][1]?.letter()
    ) {
      if (walkCell.neighboors[1][0].letter()) {
        nbLetters++;
      }
      walkCell = walkCell.neighboors[1][0];
      from--;
    }
    let to = 0;
    walkCell = cell;
    while (
      to <= 5 &&
      walkCell.neighboors[1][1] &&
      !walkCell.neighboors[1][1].neighboors[1][1]?.letter() &&
      !walkCell.neighboors[1][1].neighboors[0][0]?.letter() &&
      !walkCell.neighboors[1][1].neighboors[0][1]?.letter()
    ) {
      if (walkCell.neighboors[1][1].letter()) {
        nbLetters++;
      }
      walkCell = walkCell.neighboors[1][1];
      to++;
    }
    if (to - from >= 3) {
      return { direction: 'vertical', from, to, cell, nbLetters };
    } else {
      return false;
    }
  } else {
    // call was set using vertical
    if (cell.neighboors[0][0]?.letter() || cell.neighboors[0][1]?.letter()) {
      return false;
    }
    let nbLetters = 1;
    let from = 0;
    let walkCell = cell;
    while (
      from >= -5 &&
      walkCell.neighboors[0][0] &&
      !walkCell.neighboors[0][0].neighboors[0][0]?.letter() &&
      !walkCell.neighboors[0][0].neighboors[1][0]?.letter() &&
      !walkCell.neighboors[0][0].neighboors[1][1]?.letter()
    ) {
      if (walkCell.neighboors[0][0].letter()) {
        nbLetters++;
      }
      walkCell = walkCell.neighboors[0][0];
      from--;
    }
    let to = 0;
    walkCell = cell;
    while (
      to <= 5 &&
      walkCell.neighboors[0][1] &&
      !walkCell.neighboors[0][1].neighboors[0][1]?.letter() &&
      !walkCell.neighboors[0][1].neighboors[1][0]?.letter() &&
      !walkCell.neighboors[0][1].neighboors[1][1]?.letter()
    ) {
      if (walkCell.neighboors[0][1].letter()) {
        nbLetters++;
      }
      walkCell = walkCell.neighboors[0][1];
      to++;
    }
    if (to - from >= 3) {
      return { direction: 'horizontal', from, to, cell, nbLetters };
    } else {
      return false;
    }
  }
}

export async function canUseEditable(editable: EditableSpot): Promise<EditableWord | undefined> {
  return undefined;
}

export async function completeWord(force = false): Promise<void> {
  const editableWord = selectedEditable();
  if (editableWord && (force || editableWord.isValid())) {
    const forNewEdits = useableForNewEditable();
    for (const cell of editableWord.cells) {
      if (!cell.letter()) {
        cell.letter.set(cell.tempLetter());
        forNewEdits.push(cell);
      }
    }

    const editableSpots: EditableSpot[] = [];
    let updatedUseableForNewEditable: Cell[] = [];
    batch(() => {
      for (const cell of forNewEdits) {
        const editableSpot = canCreateEditable(cell);
        if (editableSpot) {
          updatedUseableForNewEditable.push(cell);
          editableSpots.push(editableSpot);
        }
      }
    });

    //useableForNewEditable.set(updatedUseableForNewEditable);
    editableSpots.sort((a, b) => (b.nbLetters - a.nbLetters) * 2 + Math.random());
    const toExclude = new Set<Cell>();
    let index = 0;
    // choose first possible editable spot
    let firstEditable: EditableWord | undefined = undefined;
    let firstSpot: EditableSpot | undefined = undefined;
    while (index < editableSpots.length && !firstEditable) {
      const testingEditable = editableSpots[index];
      firstEditable = await canUseEditable(testingEditable);
      if (firstEditable) {
        firstSpot = testingEditable;
      } else {
        toExclude.add(testingEditable.cell);
      }
      index++;
    }
    // choose second possible editable, filering all spots with the origin cell being in the same row or column as the origin cell of the first spot
    let secondEditable: EditableWord | undefined = undefined;
    while (index < editableSpots.length && !firstEditable) {
      const testingEditable = editableSpots[index];
      if (
        (testingEditable.cell.x === firstSpot!.cell.x &&
          (testingEditable.direction === 'vertical' || firstSpot!.direction === 'vertical')) ||
        (testingEditable.cell.y === firstSpot!.cell.y &&
          (testingEditable.direction === 'horizontal' || firstSpot!.direction === 'horizontal'))
      ) {
        continue;
      }
      secondEditable = await canUseEditable(testingEditable);
      if (!secondEditable) {
        toExclude.add(testingEditable.cell);
      }
      index++;
    }

    updatedUseableForNewEditable = updatedUseableForNewEditable.filter(
      (cell) => !toExclude.has(cell)
    );
    batch(() => {
      useableForNewEditable.set(updatedUseableForNewEditable);
      selectedEditable.set(undefined);
      // TODO => logic to create two editable words
      if (firstEditable && secondEditable) {
        editableWords.set([firstEditable, secondEditable]);
      } else {
        // TODO end of level
      }
    });
  }
}

export function initializeGrid(width: number, height: number, firstWord: string) {
  // clean data
  reset();
  const newGrid: Cell[][] = [];
  for (let j = 0; j < height; j++) {
    newGrid.push([]);
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      newGrid[y].push(new Cell(x, y));
    }
  }
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x < width - 1) {
        newGrid[y][x].neighboors[0][1] = newGrid[y][x + 1];
        newGrid[y][x + 1].neighboors[0][0] = newGrid[y][x];
      }
      if (y < height - 1) {
        newGrid[y][x].neighboors[1][1] = newGrid[y + 1][x];
        newGrid[y + 1][x].neighboors[1][0] = newGrid[y][x];
      }
    }
  }
  grid.set(newGrid);
  const yFirstWord = Math.floor(height / 2);
  let xFirstLetter = Math.floor(width / 2 - firstWord.length / 2);
  const newCompleted: Cell[] = [];
  for (const letter of firstWord.split('') as Letter[]) {
    newCompleted.push(newGrid[yFirstWord][xFirstLetter]);
    newGrid[yFirstWord][xFirstLetter].tempLetter.set(letter);
    xFirstLetter++;
  }
  selectedEditable.set(new EditableWord(newCompleted, 'horizontal'));
  completeWord(true);
}
