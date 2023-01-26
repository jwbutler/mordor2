import { GameState } from '../classes/GameState';
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

const fromString = (
  data: string,
  startingPoint: Coordinates,
  startingDirection: CompassDirection,
  state: GameState
): Level => {
  const tiles: Tile[][] = [];
  const rows = data.split('\n');
  const height = rows.length;

  for (let y = 0; y < height; y++) {
    const row: Tile[] = [...rows[y].trim()].map(char => {
      switch (char) {
        case '#': return wall();
        case 'D': return door();
        case 'S': return stairs();
        case 'C': return { type: 'floor', enemies: [createCrocDog(state)], objects: [], door: false, stairs: false };
        case 'k': return { type: 'floor', enemies: [createKobold(state)], objects: [], door: false, stairs: false };
        case 'K': return { type: 'floor', enemies: [createKoboldWarrior(state)], objects: [], door: false, stairs: false };
        case 'M': return { type: 'floor', enemies: [createMudMan(state)], objects: [], door: false, stairs: false };
        case 'G': return { type: 'floor', enemies: [createGhoul(state)], objects: [], door: false, stairs: false };
        case 'E': return { type: 'floor', enemies: [createRandomEnemy(state)], objects: [], door: false, stairs: false };
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

export const createFirstLevel = (state: GameState): Level => {
  const data = `
    #######
    D  C k#
    ##### #
    #C   k#
    # #####
    #C   M#
    #######
  `;
  return fromString(data, { x: 1, y: 1 }, 'east', state);
};

export const smallerLevel = (state: GameState): Level => {
  const data = `
    #####
    # k #
    ### #
    #####
  `;
  return fromString(data, { x: 1, y: 1 }, 'east', state);
};

export const biggerLevel = (state: GameState) => {
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
  return fromString(data, { x: 14, y: 7 }, 'west', state);
};

export const willLevel = (state: GameState) => {
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
  return fromString(data, { x: 1, y: 28 }, 'east', state);
};

export const doorsTest = (state: GameState) => {
  const data = `
    ######
    #    D
    #    #
    ######
  `;
  return fromString(data, { x: 1, y: 1 }, 'east', state);
};

export const manyKobolds = (state: GameState) => {
  const data = `
    ################
    #KKKKKKKKKKKKK D
    ################
  `;
  return fromString(data, { x: 14, y: 1 }, 'west', state);
};
