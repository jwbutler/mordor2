import { GameState } from '../classes/GameState';
import { CompassDirection, Coordinates } from '../lib/geometry';
import { Level } from '../lib/levels';
import { isDoor, isFloor, isWall, Tile } from '../lib/tiles';
import styles from './MinimapView.module.css';

const tileClass = (tile: Tile | null, currentTile: Tile, currentDirection: CompassDirection): string => {
  const classNames: string[] = [styles.tile];
  if (isDoor(tile)) {
    classNames.push(styles.door);
  } else if (isWall(tile)) {
    classNames.push(styles.wall);
  } else if (isFloor(tile)) {
    classNames.push(styles.floor);
  }

  if (tile === currentTile) {
    classNames.push(styles.current);
    classNames.push(styles[currentDirection]);
    classNames.push(styles.arrow);
  }
  return classNames.join(' ');
};

const getVisibleTiles = (level: Level, coordinates: Coordinates, radius: number) => {
  const visibleTiles = [];

  const minY = coordinates.y - radius;
  const maxY = coordinates.y + radius;
  const minX = coordinates.x - radius;
  const maxX = coordinates.x + radius;

  for (let y = minY; y <= maxY; y++) {
    const row: (Tile | null)[] = [];
    for (let x = minX; x <= maxX; x++) {
      row.push(level.tiles[y]?.[x] || null);
    }
    visibleTiles.push(row);
  }
  return visibleTiles;
};

type Props = Readonly<{
  state: GameState
}>;

const MinimapView = ({ state }: Props) => {
  const coordinates = state.getPlayer().coordinates;
  const visibleTiles = getVisibleTiles(state.getLevel(), coordinates, 3);
  const direction = state.getPlayer().direction;

  return (
    <div className={styles.map}>
      {visibleTiles.map((row, y) => (
        <div className={styles.row} key={y}>
          {row.map((tile, x) => (
            <div id={`${x}_${y}`} key={`${x}_${y}`} className={tileClass(tile, state.getCurrentTile(), direction)}>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MinimapView;
