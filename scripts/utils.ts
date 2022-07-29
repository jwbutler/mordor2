import { createCanvas, Image, loadImage, ImageData } from 'canvas';
import { Pair, RGBA } from './types';

const matches = (a: RGBA, b: RGBA) => JSON.stringify(a) === JSON.stringify(b);

const replaceColors = async (image: Image, paletteSwaps: Pair<RGBA>[]): Promise<Image> => {
  const imageData = getImageData(image);
  const array = new Uint8ClampedArray(imageData.data.length);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b, a] = imageData.data.slice(i, i + 4);
    array[i] = r;
    array[i + 1] = g;
    array[i + 2] = b;
    array[i + 3] = a;

    for (const [src, dest] of paletteSwaps) {
      if (matches(src, [r, g, b, a])) {
        array[i] = dest[0];
        array[i + 1] = dest[1];
        array[i + 2] = dest[2];
        array[i + 3] = dest[3];
      }
    }
  }

  const copy = new ImageData(array, imageData.width, imageData.height);
  return toImage(copy);
};

const getDistance = ([r1, g1, b1, a1]: RGBA, [r2, g2, b2, a2]: RGBA) => Math.sqrt(
  (r2 - r1) ** 2
  + (g2 - g1) ** 2
  + (b2 - b1) ** 2
  + (a2 - a1) ** 2
);

const flattenColors = async (image: Image, allowedColors: RGBA[]): Promise<Image> => {
  const imageData = getImageData(image);
  const array = new Uint8ClampedArray(imageData.data.length);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b, a] = imageData.data.slice(i, i + 4);

    array[i] = r;
    array[i + 1] = g;
    array[i + 2] = b;
    array[i + 3] = a;

    const closestColor: RGBA = allowedColors.sort((first, second) =>
      getDistance(first, [r, g, b, a]) - getDistance(second, [r, g, b, a])
    )[0];

    array[i] = closestColor[0];
    array[i + 1] = closestColor[1];
    array[i + 2] = closestColor[2];
    array[i + 3] = closestColor[3];
  }

  const copy = new ImageData(array, imageData.width, imageData.height);
  return toImage(copy);
};

const getImageData = (image: Image): ImageData => {
  const _canvas = createCanvas(image.width, image.height);
  const context = _canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
};

const toImage = async (imageData: ImageData): Promise<Image> => {
  const _canvas = createCanvas(imageData.width, imageData.height);
  const context = _canvas.getContext('2d');
  context.putImageData(imageData, 0, 0);
  return loadImage(_canvas.toBuffer());
};

const toBuffer = (image: Image) => {
  const _canvas = createCanvas(image.width, image.height);
  const context = _canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return _canvas.toBuffer();
};

export {
  flattenColors,
  matches,
  replaceColors,
  toBuffer
};
