import _canvas from 'canvas';
import { writeFile } from 'fs/promises';
import rimraf from 'rimraf';
const { loadImage } = _canvas;
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import imageMin from 'imagemin';
import pngquantPlugin from 'imagemin-pngquant';
import optipngPlugin from 'imagemin-optipng';
import type { RGBA, Pair } from './types';
import Colors from './colors';
import { replaceColors, toBuffer } from './utils';

const baseDir = 'images';
const wallDir = 'tmp/walls';
const tmpDir = 'tmp/images';
const outDir = 'src/images/gen';

const getPaletteSwaps = (filename: string): Pair<RGBA>[] => {
  if (filename.match(/hall/g)) {
    return [
      [Colors.WHITE, Colors.TRANSPARENT],
      [Colors.RED, Colors.DARK_GRAY]
    ];
  } else if (filename.match(/wall/g)) {
    return [
      [Colors.WHITE, Colors.TRANSPARENT],
      [Colors.RED, Colors.DARK_GRAY]
    ];
  } else if (filename.match(/floor/g)) {
    return [
      [Colors.WHITE, Colors.TRANSPARENT],
      [Colors.YELLOW, Colors.BROWN],
      [Colors.BLUE, Colors.BROWN],
    ];
  } else if (filename.match(/door/g)) {
    return [
      [Colors.WHITE, Colors.TRANSPARENT],
      [Colors.MAGENTA, Colors.BROWN],
      [Colors.BLUE, Colors.DARK_GRAY],
      [Colors.YELLOW, Colors.DARK_YELLOW]
    ];
  } else if (filename.match(/arrow/g)) {
    return [];
  } else if (filename.match(/crocdog/g)) {
    return [
      [Colors.GREEN, Colors.LIGHT_GRAY],
      [Colors.BLUE, Colors.DARK_GRAY],
      [Colors.YELLOW, Colors.TEAL],
      [Colors.WHITE, Colors.TRANSPARENT]
    ];
  } else if (filename.match(/mudman/g)) {
    return [
      [Colors.GREEN, Colors.BROWN],
      [Colors.WHITE, Colors.TRANSPARENT]
    ];
  } else {
    return [
      [Colors.WHITE, Colors.TRANSPARENT]
    ];
  }
};

const main = async () => {
  rimraf.sync(tmpDir);
  rimraf.sync(outDir);
  mkdirSync(baseDir, { recursive: true });
  mkdirSync(tmpDir, { recursive: true });
  mkdirSync(wallDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  const promises: Promise<void>[] = [];
  
  for (const filename of readdirSync(baseDir)) {
    promises.push(new Promise(async (resolve) => {
      const image = await loadImage(`${baseDir}/${filename}`);
      const swapped = await replaceColors(image, getPaletteSwaps(filename));
      const outputBuffer = toBuffer(swapped);
      const outputFilename = `${tmpDir}/${filename.replace('bmp', 'png').replaceAll('jpg', 'png').replaceAll('jpeg', 'png').replaceAll(/ /g, '_')}`;
      promises.push(writeFile(outputFilename, outputBuffer));
      console.log(outputFilename);
      resolve(await writeFile(outputFilename, outputBuffer));
    }));
  }

  for (const filename of readdirSync(wallDir)) {
    promises.push(new Promise(async (resolve) => {
      const image = await loadImage(`${wallDir}/${filename}`);
      const swapped = await replaceColors(image, getPaletteSwaps(filename));
      const outputBuffer = toBuffer(swapped);
      const outputFilename = `${tmpDir}/${filename.replace('bmp', 'png').replaceAll('jpg', 'png').replaceAll('jpeg', 'png').replaceAll(/ /g, '_')}`;
      console.log(outputFilename);
      resolve(await writeFile(outputFilename, outputBuffer));
    }));
  }

  await Promise.all(promises);

  await imageMin([`${tmpDir}/*`], {
    destination: outDir,
    plugins: [optipngPlugin(), pngquantPlugin()]
  });
  
  for (const filename of readdirSync(outDir)) {
    console.log(`${outDir}/${filename}`);
  }
};

main().then(() => {});
