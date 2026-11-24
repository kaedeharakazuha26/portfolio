import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  FACE_MOVES,
  generateScramble,
  getFaceSlot,
  invertMove,
  invertSequence,
  moveFromKey,
  rotateGridCoord,
  type CubeMove,
  type FaceKey,
  type GridCoord,
} from './cubeLogic.ts';

function applyMovesToCube(moves: readonly CubeMove[]): Map<string, GridCoord> {
  const cubies = new Map<string, GridCoord>();
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.set(`${x},${y},${z}`, [x, y, z]);
      }
    }
  }

  for (const move of moves) {
    const axisIdx = move.axis === 'x' ? 0 : move.axis === 'y' ? 1 : 2;
    for (const [id, coord] of cubies.entries()) {
      if (coord[axisIdx] === move.layer) {
        cubies.set(id, rotateGridCoord(coord, move.axis, move.dir));
      }
    }
  }
  return cubies;
}

describe('cubeLogic', () => {
  it('returns any cubie coordinate to origin after 4 quarter-turns on each axis', () => {
    const start: GridCoord = [1, 1, -1];
    for (const axis of ['x', 'y', 'z'] as const) {
      for (const dir of [1, -1] as const) {
        let cur: GridCoord = start;
        for (let i = 0; i < 4; i++) {
          cur = rotateGridCoord(cur, axis, dir);
        }
        assert.deepStrictEqual(cur, start);
      }
    }
  });

  it('unwinds any scramble cleanly back to solved coordinates with invertSequence', () => {
    let seed = 42;
    const deterministicRng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const scramble = generateScramble(16, deterministicRng);
    assert.equal(scramble.length, 16);

    // Consecutive moves should never touch the exact same slice
    for (let i = 1; i < scramble.length; i++) {
      const sameSlice =
        scramble[i].axis === scramble[i - 1].axis &&
        scramble[i].layer === scramble[i - 1].layer;
      assert.equal(sameSlice, false);
    }

    const solved = applyMovesToCube([...scramble, ...invertSequence(scramble)]);
    for (const [id, coord] of solved.entries()) {
      const expected = id.split(',').map(Number);
      assert.deepStrictEqual(coord, expected);
    }
  });

  it('parses standard and prime keyboard notation accurately', () => {
    assert.deepStrictEqual(moveFromKey('u', false), FACE_MOVES.U);
    assert.deepStrictEqual(moveFromKey('U', true), invertMove(FACE_MOVES.U));
    assert.equal(moveFromKey('x', false), null);
  });

  it('maps every outer face cleanly to unique 0..8 slot indices', () => {
    const faces: Array<{ face: FaceKey; coords: GridCoord[] }> = [
      { face: 'F', coords: [] },
      { face: 'B', coords: [] },
      { face: 'R', coords: [] },
      { face: 'L', coords: [] },
      { face: 'U', coords: [] },
      { face: 'D', coords: [] },
    ];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (z === 1) faces[0].coords.push([x, y, z]);
          if (z === -1) faces[1].coords.push([x, y, z]);
          if (x === 1) faces[2].coords.push([x, y, z]);
          if (x === -1) faces[3].coords.push([x, y, z]);
          if (y === 1) faces[4].coords.push([x, y, z]);
          if (y === -1) faces[5].coords.push([x, y, z]);
        }
      }
    }

    for (const { face, coords } of faces) {
      const slots = coords
        .map(([x, y, z]) => getFaceSlot(face, x, y, z))
        .sort((a, b) => a - b);
      assert.deepStrictEqual(slots, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }
  });
});
