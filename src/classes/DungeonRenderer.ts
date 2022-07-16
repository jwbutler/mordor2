import door2 from '../images/gen/door2.png';
import floor_ceiling from '../images/gen/floor_ceiling.png';
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

import { rotateLeft, rotateRight } from '../lib/geometry';
import { createImage } from '../lib/images';
import { getTile, getTilesInView, TileViewColumn } from '../lib/levels';
import { isDoor, isDoorFacingDirection, isStairs, isWall, isWallLike, Tile } from '../lib/tiles';
import { GameState } from './GameState';

const maxDepth = 4;

type RenderState = {
  floorCeiling: string,
  left: (string | null)[],
  center: (string | null)[],
  right: (string | null)[],
  doors: (string | null)[],
  stairs: (string | null)[],
  unit: (string | null)
};

const dungeonImages = {
  hallsLeft: [hall_left_0, hall_left_1, hall_left_2, hall_left_3],
  hallsRight: [hall_right_0, hall_right_1, hall_right_2, hall_right_3],
  wallsCenter: [wall_center_1, wall_center_2, wall_center_3, wall_center_4],
  wallsLeft: [wall_left_1, wall_left_2, wall_left_3, wall_left_4],
  wallsRight: [wall_right_1, wall_right_2, wall_right_3, wall_right_4],
  doors: [door2, null, null, null],
  stairs: [door2, null, null, null],
  floorCeiling: floor_ceiling
};

const drawImage = async (src: string, context: CanvasRenderingContext2D) => {
  const imageData = await createImage(src);
  context.putImageData(imageData, 0, 0);
};

class DungeonRenderer {
  renderTiles = async (buffer: HTMLCanvasElement) => {
    const state: GameState = GameState.getInstance();
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
      doors,
      stairs,
      floorCeiling
    } = dungeonImages;
    
    const images: RenderState = {
      floorCeiling,
      left: [],
      center: [],
      right: [],
      doors: [],
      stairs: [],
      unit: null
    };
    
    for (let i = 0; i < maxDepth; i++) {
      const left = (isWallLike(tiles['left'][i], rotateLeft(direction)) || isDoor(tiles['left'][i]))
        ? hallsLeft[i]
        : (isWallLike(tiles['left'][i + 1], direction))
        ? wallsLeft[i]
        : null;
      images['left'].push(left);
      
      const center = (isWall(tiles['center'][i + 1]) || isDoor(tiles['center'][i + 1]) || isStairs(tiles['center'][i + 1]))
        ? wallsCenter[i]
        : null;
      images['center'].push(center);
      
      const right = (isWallLike(tiles['right'][i], rotateRight(direction)) || isDoor(tiles['right'][i]))
        ? hallsRight[i]
        : (isWallLike(tiles['right'][i + 1], direction))
        ? wallsRight[i]
        : null;
      images['right'].push(right);
      
      const door = (isDoorFacingDirection(tiles['center'][i + 1], direction))
        ? doors[i]
        : null;
      images['doors'].push(door);
      
      const stair = (tiles['center'][i + 1]?.type === 'stairs')
        ? stairs[i]
        : null;
      images['stairs'].push(stair);
    }
  
    const tile = getTile(level, coordinates);
    const enemy = tile?.enemies[0];
    if ((enemy?.life || 0) > 0) {
      images['unit'] = enemy?.sprite?.images.standing || null;
    }
    
    const bufferContext = buffer.getContext('2d') as CanvasRenderingContext2D;
    bufferContext.fillStyle = 'black';
    await drawImage(images.floorCeiling, bufferContext);

    for (let i = 3; i >= 0; i--) {
      const keys: (keyof RenderState)[] = ['left', 'center', 'right', 'doors', 'stairs'];
      for (const category of keys) {
        const image = images[category]?.[i];
        if (image) {
          await drawImage(image, bufferContext);
        }
      }
    }
    if (images.unit !== null) {
      await drawImage(images.unit, bufferContext);
    }
  };
}

export default DungeonRenderer;
