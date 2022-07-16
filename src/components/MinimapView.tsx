import { GameState } from '../classes/GameState';
import { CompassDirection, Coordinates } from '../lib/geometry';
import { Level } from '../lib/levels';
import { Tile } from '../lib/tiles';
import styles from './MinimapView.module.css';

const tileClass = (tile: Tile | null, currentTile: Tile, currentDirection: CompassDirection): string => {
  const classNames: string[] = [styles.tile, styles[tile?.type || 'wall']];
  if (tile === currentTile) {
    classNames.push(styles.currentcurrent);
    classNames.push(styles[`${currentDirection}Arrow`]);
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

const MinimapView = () => {
  const state = GameState.getInstance();
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
