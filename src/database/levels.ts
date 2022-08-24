import type { CompassDirection, Coordinates } from '../lib/geometry';
import type { Level } from '../lib/levels';
import type { Tile } from '../lib/tiles';
import { createKobold, createCrocDog, createMudMan, createGhoul } from './units';

const floor = (): Tile => ({ type: 'floor', enemies: [], objects: [], door: false, stairs: false });
const wall = (): Tile => ({ type: 'wall', enemies: [], objects: [], door: false, stairs: false });
const door = (): Tile => ({ type: 'wall', enemies: [], objects: [], door: true, stairs: false });
const stairs = (): Tile => ({ type: 'wall', enemies: [], objects: [], door: false, stairs: true });

const fromString = (data: string, startingPoint: Coordinates, startingDirection: CompassDirection): Level => {
  const tiles: Tile[][] = [];
  const rows = data.split('\n');
  const height = rows.length;

  for (let y = 0; y < height; y++) {
    const row: Tile[] = [...rows[y].trim()].map(char => {
      switch (char) {
        case '#': return wall();
        case 'D': return door();
        case 'S': return stairs();
        case 'C': return { type: 'floor', enemies: [createCrocDog()], objects: [], door: false, stairs: false };
        case 'K': return { type: 'floor', enemies: [createKobold()], objects: [], door: false, stairs: false };
        case 'M': return { type: 'floor', enemies: [createMudMan()], objects: [], door: false, stairs: false };
        case 'G': return { type: 'floor', enemies: [createGhoul()], objects: [], door: false, stairs: false };
        default:  return floor();
      }
    });
    if (row.length > 0) {
      tiles.push(row);
    }
  }

  return {
    tiles,
    width: tiles[0].length,
    height: tiles.length,
    startingPoint,
    startingDirection
  };
};

const createFirstLevel = (): Level => {
  const data = `
    #######
    D  C K#
    ##### #
    #C   K#
    # #####
    #C   M#
    #######
  `;
  return fromString(data, { x: 1, y: 1 }, 'east');
};

const smallerLevel = (): Level => {
  const data = `
    #####
    # K #
    ### #
    #####
  `;
  return fromString(data, { x: 1, y: 1 }, 'east');
};

const biggerLevel = () => {
  const data = `
    ################
    #G   ######  K##
    #### #C#C   # ##
    #K## # # #### M#
    #    # # ##K  ##
    # ##  K  ## # C#
    # K#### ### ####
    ##   C  #G     D
    ################
  `;
  return fromString(data, { x: 14, y: 7 }, 'west');
};

const doorsTest = () => {
  const data = `
    ######
    #    D
    #    #
    ######
  `;
  return fromString(data, { x: 1, y: 1 }, 'east');
};

const manyKobolds = () => {
  const data = `
    ################
    #KKKKKKKKKKKKK D
    ################
  `;
  return fromString(data, { x: 14, y: 1 }, 'west');
};

export {
  createFirstLevel,
  biggerLevel,
  doorsTest,
  smallerLevel,
  manyKobolds
};
