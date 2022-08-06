import type { MapObject } from './objects';
import Unit from '../classes/Unit';

type TileType = 'floor' | 'wall' | 'stairs';

type Tile = {
  type: TileType,
  enemies: Unit[],
  objects: MapObject[],
  door: boolean,
  stairs: boolean
};

const isWall = (tile: Tile | null) => tile?.type === 'wall';
const isDoor = (tile: Tile | null) => tile?.door;

const isStairs = (tile: Tile | null) => tile?.type === 'stairs';

export type {
  Tile
};

export {
  isDoor,
  isStairs, 
  isWall
};
