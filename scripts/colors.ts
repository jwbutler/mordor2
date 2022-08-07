import { RGBA } from './types';

const Colors: Record<string, RGBA> = {
  BLACK: [0, 0, 0, 255],
  BLUE: [0, 0, 255, 255],
  BROWN: [128, 64, 0, 255],
  CYAN: [0, 255, 255, 255],
  LIGHT_GRAY: [192, 192, 192, 255],
  LIGHTER_GRAY: [224, 224, 224, 255],
  DARK_BROWN: [64, 32, 0, 255],
  DARK_GRAY: [128, 128, 128, 255],
  DARK_GREEN: [0, 128, 0, 255],
  DARK_YELLOW: [128, 128, 0, 255],
  DARKER_GRAY: [64, 64, 64, 255],
  GREEN: [0, 255, 0, 255],
  MAGENTA: [255, 0, 255, 255],
  RED: [255, 0, 0, 255],
  TEAL: [0, 128, 128, 255],
  TRANSPARENT: [0, 0, 0, 0],
  WHITE: [255, 255, 255, 255],
  YELLOW: [255, 255, 0, 255]
};

export default Colors;
