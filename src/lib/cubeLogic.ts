// Pure mathematical utilities for 3x3x3 Rubik's Cube layer rotations and move stacks.

export type Axis = 'x' | 'y' | 'z';
export type Layer = -1 | 0 | 1;
export type Direction = 1 | -1;
export type GridCoord = [number, number, number];
export type FaceKey = 'F' | 'R' | 'U' | 'L' | 'B' | 'D';

export interface CubeMove {
  axis: Axis;
  layer: Layer;
  dir: Direction;
  notation: string;
}

export const FACE_MOVES: Record<FaceKey, CubeMove> = {
  U: { axis: 'y', layer: 1, dir: -1, notation: 'U' },
  D: { axis: 'y', layer: -1, dir: 1, notation: 'D' },
  R: { axis: 'x', layer: 1, dir: -1, notation: 'R' },
  L: { axis: 'x', layer: -1, dir: 1, notation: 'L' },
  F: { axis: 'z', layer: 1, dir: -1, notation: 'F' },
  B: { axis: 'z', layer: -1, dir: 1, notation: 'B' },
};

const ALL_OUTER_MOVES: CubeMove[] = [
  ...Object.values(FACE_MOVES),
  ...Object.values(FACE_MOVES).map((move) => ({
    ...move,
    dir: (move.dir * -1) as Direction,
    notation: `${move.notation}'`,
  })),
];

function cleanZero(n: number): number {
  return n === 0 ? 0 : n;
}

/**
 * Rotates an integer cubie coordinate [x, y, z] by 90° * dir around the given axis
 * using Three.js right-handed coordinates.
 */
export function rotateGridCoord(
  coord: GridCoord,
  axis: Axis,
  dir: Direction,
): GridCoord {
  const [x, y, z] = coord;
  if (axis === 'x') {
    return dir === 1
      ? [cleanZero(x), cleanZero(-z), cleanZero(y)]
      : [cleanZero(x), cleanZero(z), cleanZero(-y)];
  }
  if (axis === 'y') {
    return dir === 1
      ? [cleanZero(z), cleanZero(y), cleanZero(-x)]
      : [cleanZero(-z), cleanZero(y), cleanZero(x)];
  }
  return dir === 1
    ? [cleanZero(-y), cleanZero(x), cleanZero(z)]
    : [cleanZero(y), cleanZero(-x), cleanZero(z)];
}

/** Returns the exact inverse quarter-turn for a given move. */
export function invertMove(move: CubeMove): CubeMove {
  const dir = (move.dir * -1) as Direction;
  const notation = move.notation.endsWith("'")
    ? move.notation.slice(0, -1)
    : `${move.notation}'`;
  return { axis: move.axis, layer: move.layer, dir, notation };
}

/** Returns the sequence that completely unwinds a history of moves back to solved state. */
export function invertSequence(moves: readonly CubeMove[]): CubeMove[] {
  return [...moves].reverse().map(invertMove);
}

/** Generates a valid non-canceling scramble sequence of outer-layer quarter turns. */
export function generateScramble(
  count: number,
  rng: () => number = Math.random,
): CubeMove[] {
  const result: CubeMove[] = [];
  for (let i = 0; i < count; i++) {
    const prev = result[i - 1];
    const candidates = ALL_OUTER_MOVES.filter((candidate) => {
      if (!prev) return true;
      // Avoid repeating the same slice consecutively (cancel or redundant double move).
      return !(candidate.axis === prev.axis && candidate.layer === prev.layer);
    });
    const idx = Math.floor(rng() * candidates.length);
    result.push(candidates[Math.min(idx, candidates.length - 1)]);
  }
  return result;
}

/** Picks a single random outer-layer move that does not cancel the last move. */
export function randomMove(
  previous?: CubeMove,
  rng: () => number = Math.random,
): CubeMove {
  const candidates = ALL_OUTER_MOVES.filter((candidate) => {
    if (!previous) return true;
    return !(candidate.axis === previous.axis && candidate.layer === previous.layer);
  });
  const idx = Math.floor(rng() * candidates.length);
  return candidates[Math.min(idx, candidates.length - 1)];
}

/** Maps a keyboard key ('u','d','l','r','f','b', optionally shifted for prime) to a CubeMove. */
export function moveFromKey(key: string, shiftKey = false): CubeMove | null {
  const upper = key.toUpperCase() as FaceKey;
  const base = FACE_MOVES[upper];
  if (!base) return null;
  return shiftKey ? invertMove(base) : base;
}

/**
 * Returns the 0..8 row-major slot index (top-left to bottom-right when facing that side)
 * for a cubie at integer grid coordinates [x, y, z].
 */
export function getFaceSlot(
  face: FaceKey,
  x: number,
  y: number,
  z: number,
): number {
  let row = 0;
  let col = 0;
  switch (face) {
    case 'F':
      row = 1 - y;
      col = x + 1;
      break;
    case 'R':
      row = 1 - y;
      col = 1 - z;
      break;
    case 'B':
      row = 1 - y;
      col = 1 - x;
      break;
    case 'L':
      row = 1 - y;
      col = z + 1;
      break;
    case 'U':
      row = z + 1;
      col = x + 1;
      break;
    case 'D':
      row = 1 - z;
      col = x + 1;
      break;
  }
  return row * 3 + col;
}
