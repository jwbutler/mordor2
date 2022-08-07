import { type Image, createCanvas, loadImage, Canvas } from 'canvas';
import { mkdirSync, writeFileSync } from 'fs';
import Colors from './colors';
import { flattenColors, flipHorizontal, toBuffer, writeImage } from './utils';

// Forcing code down the compiler's throat to make PerspectiveJS work.
// TODO write some defs

// noinspection JSConstantReassignment
global.window = global.window || {};
// noinspection JSConstantReassignment
global.document = global.document || {};
// @ts-ignore
document.createElement = (type: string): Canvas => {
  if (type === 'canvas') {
    return createCanvas(640, 480);
  }
  throw new Error();
};

const Perspective: any = require('perspectivejs');

type Side = 'left' | 'center' | 'right';
type WallType = 'wall' | 'hall';
// top-left, top-right, bottom-right, bottom-left
type Quadrangle = [[number, number],[number, number],[number, number],[number, number]];
type Depth = 0 | 1 | 2 | 3 | 4;

const baseDir = 'images';
const tmpDir = 'tmp/walls';

type WallDef = {
  type: WallType,
  side: Side,
  depth: Depth
};

const main = async () => {
  mkdirSync(tmpDir, { recursive: true });
  await Promise.all([
    generateHallsAndWalls('walltexturegray'),
    generateDoors('door_texture')
  ]);
};

const generateHallsAndWalls = async (filename: string) => {
  const image: Image = await loadImage(`${baseDir}/${filename}.png`);
  const defs: WallDef[] = [];
  // halls
  const hallSides: Side[] = ['left', 'right'];
  for (const side of hallSides) {
    for (let depth = 0; depth <= 3; depth++) {
      defs.push({ side, depth: depth as Depth, type: 'hall' });
    }
  }
  const wallSides: Side[] = ['left', 'center', 'right'];
  for (const side of wallSides) {
    for (let depth = 1; depth <= 4; depth++) {
      defs.push({ side, depth: depth as Depth, type: 'wall' });
    }
  }

  const promises: Promise<void>[] = [];

  for (const { depth, side, type } of defs) {
    const filename = `${type}_${side}_${depth}.png`;
    const path = `${tmpDir}/${filename}`;
    const transform = getQuadrangle(type, side, depth);
    promises.push(new Promise(async (resolve) => {
      const transformed = await transformImage(image, transform);
      const flattened = await flattenColors(transformed, [Colors.DARK_GRAY, Colors.BLACK, Colors.WHITE, Colors.TRANSPARENT]);
      console.log(filename);
      resolve(await writeImage(flattened, path));
    }));

    // TODO bugged, Sharp sux
    //const flipped = await flipHorizontal(flattened);
    //const flippedPath = `${tmpDir}/${type}_${side}_${depth}_R.png`;
    //await writeImage(flipped, flippedPath);
  }

  await Promise.all(promises);
};

const generateDoors = async (filename: string) => {
  const image: Image = await loadImage(`${baseDir}/${filename}.png`);
  const defs: WallDef[] = [];
  // halls
  const hallSides: Side[] = ['left', 'right'];
  for (const side of hallSides) {
    for (let depth = 0; depth <= 3; depth++) {
      defs.push({ side, depth: depth as Depth, type: 'hall' });
    }
  }
  const wallSides: Side[] = ['left', 'center', 'right'];
  for (const side of wallSides) {
    for (let depth = 1; depth <= 4; depth++) {
      defs.push({ side, depth: depth as Depth, type: 'wall' });
    }
  }

  const promises: Promise<void>[] = [];

  for (const { depth, side, type } of defs) {
    const filename = `door_${type}_${side}_${depth}.png`;
    const path = `${tmpDir}/${filename}`;
    const transform = getQuadrangle(type, side, depth);
    promises.push(new Promise(async (resolve) => {
      const transformed = await transformImage(image, transform);
      const flattened = await flattenColors(transformed, [Colors.DARK_GRAY, Colors.BLACK, Colors.BROWN, Colors.DARK_YELLOW, Colors.WHITE, Colors.TRANSPARENT]);
    console.log(filename);
      resolve(await writeImage(flattened, path));
    }));

    // TODO bugged, Sharp sux
    //const flipped = await flipHorizontal(flattened);
    //const flippedPath = `${tmpDir}/${type}_${side}_${depth}_R.png`;
    //await writeImage(flipped, flippedPath);
  }

  await Promise.all(promises);
};

const getQuadrangle = (type: WallType, side: Side, depth: Depth): Quadrangle => {
  switch (type) {
    case 'wall': return getWallQuadrangle(side, depth);
    case 'hall': return getHallQuadrangle(side, depth);
  }
};

const getWallQuadrangle = (side: Side, depth: Depth): Quadrangle => {
  if (depth === 0) {
    throw new Error();
  }

  const top = getTop(depth);
  const bottom = getBottom(depth);
  let left: number;
  let right: number;
  
  switch (side) {
    case 'left':
      left = getFarLeft(depth);
      right = getLeft(depth);
      break;
    case 'center':
      left = getLeft(depth);
      right = getRight(depth);
      break;
    case 'right':
      left = getRight(depth);
      right = getFarRight(depth);
      break;
  }
  
  return [[left, top], [right, top], [right, bottom], [left, bottom]];
};

const getHallQuadrangle = (side: Side, depth: Depth): Quadrangle => {
  if (depth === 4 || side === 'center') {
    throw new Error();
  }
  
  const outerTop = getTop(depth);
  const innerTop = getTop(depth + 1 as Depth);
  const outerBottom = getBottom(depth);
  const innerBottom = getBottom(depth + 1 as Depth);
  let left: number;
  let right: number;

  switch (side) {
    case 'left':
      left = getLeft(depth);
      right = getLeft(depth + 1 as Depth);
      return [[left, outerTop], [right, innerTop], [right, innerBottom], [left, outerBottom]];
    case 'right':
      left = getRight(depth + 1 as Depth);
      right = getRight(depth);
      return [[left, innerTop], [right, outerTop], [right, outerBottom], [left, innerBottom]];
  }
};

const getLeft = (depth: Depth): number => {
  switch (depth) {
    case 0: return -100;
    case 1: return 80;
    case 2: return 200;
    case 3: return 260;
    case 4: return 300;
  }
};

const getRight = (depth: Depth): number => {
  switch (depth) {
    case 0: return 740;
    case 1: return 560;
    case 2: return 440;
    case 3: return 380;
    case 4: return 340;
  }
};

const getFarLeft = (depth: Depth): number => {
  switch (depth) {
    case 0: throw new Error();
    case 1: return -160;
    case 2: return 0;
    case 3: return 140;
    case 4: return 260;
  }
};

const getFarRight = (depth: Depth): number => {
  switch (depth) {
    case 0: throw new Error();
    case 1: return 840;
    case 2: return 640;
    case 3: return 500;
    case 4: return 380;
  }
};

const getTop = (depth: Depth): number => {
  switch (depth) {
    case 0: return -380;
    case 1: return -160;
    case 2: return 0;
    case 3: return 55;
    case 4: return 100;
  }
};

const getBottom = (depth: Depth): number => {
  switch (depth) {
    case 0: return 570;
    case 1: return 360;
    case 2: return 260;
    case 3: return 190;
    case 4: return 150;
  }
};

const transformImage = async (image: Image, transform: Quadrangle): Promise<Image> => {
  const _canvas = createCanvas(640, 480);
  const context = _canvas.getContext('2d') as CanvasRenderingContext2D;
  const perspective = new Perspective(context, image);
  perspective.draw(transform);
  return loadImage(_canvas.toDataURL());
};

main().then(() => {});

export {};
