import type { CompassDirection, Coordinates } from '../lib/geometry';
import type { Level } from '../lib/levels';
import type { Tile } from '../lib/tiles';
import {
  createKobold,
  createCrocDog,
  createMudMan,
  createGhoul,
  createKoboldWarrior,
  createRandomEnemy
} from './units';

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
        case 'k': return { type: 'floor', enemies: [createKobold()], objects: [], door: false, stairs: false };
        case 'K': return { type: 'floor', enemies: [createKoboldWarrior()], objects: [], door: false, stairs: false };
        case 'M': return { type: 'floor', enemies: [createMudMan()], objects: [], door: false, stairs: false };
        case 'G': return { type: 'floor', enemies: [createGhoul()], objects: [], door: false, stairs: false };
        case 'E': return { type: 'floor', enemies: [createRandomEnemy()], objects: [], door: false, stairs: false };
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

export const createFirstLevel = (): Level => {
  const data = `
    #######
    D  C k#
    ##### #
    #C   k#
    # #####
    #C   M#
    #######
  `;
  return fromString(data, { x: 1, y: 1 }, 'east');
};

export const smallerLevel = (): Level => {
  const data = `
    #####
    # k #
    ### #
    #####
  `;
  return fromString(data, { x: 1, y: 1 }, 'east');
};

export const biggerLevel = () => {
  const data = `
    ################
    #G   ######  k##
    #### #C#C   # ##
    #K## # # #### M#
    #    # # ##k  ##
    # ##  k  ## # C#
    # K#### ### ####
    ##   C  #K     D
    ################
  `;
  return fromString(data, { x: 14, y: 7 }, 'west');
};

export const willLevel = () => {
  const data = `
    ##############################
    #   E     E#                 #
    #  # ### # # ##### ## ## ### #
    # ## ### # # # E   #E  # # # #
    # #  # # # # #E ## ### # #   #
    # #  #   # # # ###     # # # #
    # ####E# #     #   ### # ### #
    # #EE### #### ## # ##  # ##  #
    # #      #### #### ##E # ##E #
    # ######      # E  ## ## ## ##
    #     E########  # ##E## # E##
    # ### ############ #  ## #  ##
    # ###           ##    ## ## ##
    # ##E E######## ### ####E## ##
    # ###E######### ### #### ##  #
    #             #        #    E#
    ############# # ###### ##### #
    #      ###### # # #### #   # #
    # #### ###### # # #  # # # # #
    # ####        # #    # # # # #
    # #### ###### # ##E### # # # #
    # E##  ###### # ## ### # #E  #
    #  ## E#      #       E# # # #
    # ### ## ############### # # #
    #  ##  # #####          E# # #
    #E ##E # ##### ####### ### # #
    ######## #   E ####### ### # #
    ######## #E # E     E      # #
    D        ###################S#
    ##############################
  `;
  return fromString(data, { x: 1, y: 28 }, 'east');
};

export const doorsTest = () => {
  const data = `
    ######
    #    D
    #    #
    ######
  `;
  return fromString(data, { x: 1, y: 1 }, 'east');
};

export const manyKobolds = () => {
  const data = `
    ################
    #KKKKKKKKKKKKK D
    ################
  `;
  return fromString(data, { x: 14, y: 1 }, 'west');
};
