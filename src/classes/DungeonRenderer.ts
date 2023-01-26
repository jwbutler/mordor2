import floor_ceiling from '../images/gen/floor_ceiling_gritty.png';
import hall_left_0 from '../images/gen/hall_left_0.png';
import hall_left_1 from '../images/gen/hall_left_1.png';
import hall_left_2 from '../images/gen/hall_left_2.png';
import hall_left_3 from '../images/gen/hall_left_3.png';
import hall_right_0 from '../images/gen/hall_right_0.png';
import hall_right_1 from '../images/gen/hall_right_1.png';
import hall_right_2 from '../images/gen/hall_right_2.png';
import hall_right_3 from '../images/gen/hall_right_3.png';
import wall_center_1 from '../images/gen/wall_center_1.png';
import wall_center_2 from '../images/gen/wall_center_2.png';
import wall_center_3 from '../images/gen/wall_center_3.png';
import wall_center_4 from '../images/gen/wall_center_4.png';
import wall_left_1 from '../images/gen/wall_left_1.png';
import wall_left_2 from '../images/gen/wall_left_2.png';
import wall_left_3 from '../images/gen/wall_left_3.png';
import wall_left_4 from '../images/gen/wall_left_4.png';
import wall_right_1 from '../images/gen/wall_right_1.png';
import wall_right_2 from '../images/gen/wall_right_2.png';
import wall_right_3 from '../images/gen/wall_right_3.png';
import wall_right_4 from '../images/gen/wall_right_4.png';
import door_hall_left_0 from '../images/gen/door_hall_left_0.png';
import door_hall_left_1 from '../images/gen/door_hall_left_1.png';
import door_hall_left_2 from '../images/gen/door_hall_left_2.png';
import door_hall_left_3 from '../images/gen/door_hall_left_3.png';
import door_hall_right_0 from '../images/gen/door_hall_right_0.png';
import door_hall_right_1 from '../images/gen/door_hall_right_1.png';
import door_hall_right_2 from '../images/gen/door_hall_right_2.png';
import door_hall_right_3 from '../images/gen/door_hall_right_3.png';
import door_wall_center_1 from '../images/gen/door_wall_center_1.png';
import door_wall_center_2 from '../images/gen/door_wall_center_2.png';
import door_wall_center_3 from '../images/gen/door_wall_center_3.png';
import door_wall_center_4 from '../images/gen/door_wall_center_4.png';
import door_wall_left_1 from '../images/gen/door_wall_left_1.png';
import door_wall_left_2 from '../images/gen/door_wall_left_2.png';
import door_wall_left_3 from '../images/gen/door_wall_left_3.png';
import door_wall_left_4 from '../images/gen/door_wall_left_4.png';
import door_wall_right_1 from '../images/gen/door_wall_right_1.png';
import door_wall_right_2 from '../images/gen/door_wall_right_2.png';
import door_wall_right_3 from '../images/gen/door_wall_right_3.png';
import door_wall_right_4 from '../images/gen/door_wall_right_4.png';

import { createImage } from '../lib/images';
import { getTile, getTilesInView, TileViewColumn } from '../lib/levels';
import { isDoor, isStairs, isWall, Tile } from '../lib/tiles';
import { GameState } from './GameState';

const maxDepth = 4;

type Direction = 'left' | 'center' | 'right';

type RenderState = {
  floorCeiling: string,
  halls: {
    left: (string | null)[],
    center: (string | null)[],
    right: (string | null)[],
  },
  walls: {
    left: (string | null)[],
    center: (string | null)[],
    right: (string | null)[]
  },
  doorHalls: {
    left: (string | null)[],
    center: (string | null)[],
    right: (string | null)[],
  },
  doorWalls: {
    left: (string | null)[],
    center: (string | null)[],
    right: (string | null)[]
  },
  stairs: {
    left: (string | null)[],
    center: (string | null)[],
    right: (string | null)[]
  },
  unit: (string | null)
};

const dungeonImages = {
  hallsLeft: [hall_left_0, hall_left_1, hall_left_2, hall_left_3],
  hallsRight: [hall_right_0, hall_right_1, hall_right_2, hall_right_3],
  wallsCenter: [wall_center_1, wall_center_2, wall_center_3, wall_center_4],
  wallsLeft: [wall_left_1, wall_left_2, wall_left_3, wall_left_4],
  wallsRight: [wall_right_1, wall_right_2, wall_right_3, wall_right_4],
  doorHallsLeft: [door_hall_left_0, door_hall_left_1, door_hall_left_2, door_hall_left_3],
  doorHallsRight: [door_hall_right_0, door_hall_right_1, door_hall_right_2, door_hall_right_3],
  doorWallsCenter: [door_wall_center_1, door_wall_center_2, door_wall_center_3, door_wall_center_4],
  doorWallsLeft: [door_wall_left_1, door_wall_left_2, door_wall_left_3, door_wall_left_4],
  doorWallsRight: [door_wall_right_1, door_wall_right_2, door_wall_right_3, door_wall_right_4],
  floorCeiling: floor_ceiling
};

const drawImage = async (src: string, context: CanvasRenderingContext2D) => {
  const imageData = await createImage(src);
  context.putImageData(imageData, 0, 0);
};

class DungeonRenderer {
  renderTiles = async (state: GameState, buffer: HTMLCanvasElement) => {
    const t1 = new Date().getTime();
    const level = state.getLevel();
    const coordinates = state.getPlayer().coordinates;
    const direction = state.getPlayer().direction;
    const tiles: Record<TileViewColumn, (Tile | null)[]> = getTilesInView(level, coordinates, direction, maxDepth);

    const {
      hallsLeft,
      hallsRight,
      wallsCenter,
      wallsLeft,
      wallsRight,
      doorHallsLeft,
      doorHallsRight,
      doorWallsCenter,
      doorWallsLeft,
      doorWallsRight,
      floorCeiling
    } = dungeonImages;

    const images: RenderState = {
      floorCeiling,
      halls: {
        left: [],
        center: [],
        right: []
      },
      walls: {
        left: [],
        center: [],
        right: []
      },
      doorHalls: {
        left: [],
        center: [],
        right: []
      },
      doorWalls: {
        left: [],
        center: [],
        right: []
      },
      stairs: {
        left: [],
        center: [],
        right: []
      },
      unit: null
    };

    for (let i = 0; i < maxDepth; i++) {
      images.halls['left'].push(isWall(tiles['left'][i]) ? hallsLeft[i] : null);
      images.walls['left'].push(isWall(tiles['left'][i + 1]) ? wallsLeft[i] : null);
      images.doorHalls['left'].push(isDoor(tiles['left'][i]) ? doorHallsLeft[i] : null);
      images.doorWalls['left'].push(isDoor(tiles['left'][i + 1]) ? doorWallsLeft[i] : null);

      images.walls['center'].push(isWall(tiles['center'][i + 1]) ? wallsCenter[i] : null);
      images.doorWalls['center'].push(isDoor(tiles['center'][i + 1]) ? doorWallsCenter[i] : null);

      images.halls['right'].push(isWall(tiles['right'][i]) ? hallsRight[i] : null);
      images.walls['right'].push(isWall(tiles['right'][i + 1]) ? wallsRight[i] : null);
      images.doorHalls['right'].push(isDoor(tiles['right'][i]) ? doorHallsRight[i] : null);
      images.doorWalls['right'].push(isDoor(tiles['right'][i + 1]) ? doorWallsRight[i] : null);
    }

    const tile = getTile(level, coordinates);
    const enemy = tile?.enemies[0];
    if ((enemy?.life || 0) > 0) {
      images['unit'] = enemy?.sprite?.images.standing || null;
    }

    const bufferContext = buffer.getContext('2d')!;
    bufferContext.fillStyle = 'black';
    await drawImage(images.floorCeiling, bufferContext);

    for (let i = 3; i >= 0; i--) {
      const keys: Direction[] = ['left', 'center', 'right'];
      for (const direction of keys) {
        const hall = images.halls[direction]?.[i];
        const wall = images.walls[direction]?.[i];
        const hallOrWall = hall ?? wall;
        if (hallOrWall) {
          await drawImage(hallOrWall, bufferContext);
        }
        const doorHall = images.doorHalls[direction]?.[i];
        const doorWall = images.doorWalls[direction]?.[i];
        if (hall && doorHall) {
          await drawImage(doorHall, bufferContext);
        } else if (doorWall && !hall) {
          await drawImage(doorWall, bufferContext);
        }
      }
    }
    if (images.unit !== null) {
      await drawImage(images.unit, bufferContext);
    }
    const t2 = new Date().getTime();
    console.debug(`Render time: ${t2 - t1} ms`);
  };
}

export default DungeonRenderer;
