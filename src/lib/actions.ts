import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import { Coordinates, move, RelativeDirection, rotate } from './geometry';
import { getTile } from './levels';
import { isDoorFacingDirection, isStairs, isWallLike, Tile } from './tiles';

const navigate = async (relativeDirection: RelativeDirection) => {
  const state = GameState.getInstance();
  if (!state.inputEnabled() || state.getMenu() !== null) {
    return;
  }
  const player = state.getPlayer();

  switch (player.location) {
    case 'dungeon':
      const coordinates: Coordinates = (relativeDirection === 'forward')
        ? move(player.coordinates, player.direction)
        : player.coordinates;

      const direction = rotate(player.direction, relativeDirection);

      const nextTile = getTile(state.getLevel(), coordinates);
      if (isDoorFacingDirection(nextTile, direction)) {
        player.coordinates = move(coordinates, direction); // assume the developer put a floor tile there...
      } else if (isStairs(nextTile)) {
        player.location = 'town';
        if (player.unit.life < player.unit.maxLife || player.unit.mana < player.unit.maxMana) {
          player.unit.life = player.unit.maxLife;
          player.unit.mana = player.unit.maxMana;
          state.addMessage('You feel much better.');
        }
      } else if (!isWallLike(nextTile, direction)) {
        player.coordinates = coordinates;
      }
      player.direction = direction;

      await loadTile();
      return;
    case 'town':
      switch (relativeDirection) {
        case 'backward':
          player.location = 'dungeon';
          return;
        case 'forward':
          player.location = 'shop';
          return;
      }
      break;
    case 'shop':
      switch (relativeDirection) {
        case 'backward':
          player.location = 'town';
          return;
      }
      break;
  }
};

const returnToDungeon = async () => {
  const state = GameState.getInstance();
  const player = state.getPlayer();
  const level = state.getLevel();
  player.coordinates = level.startingPoint;
  player.direction = level.startingDirection;
  player.location = 'dungeon';
};

const loadTile = async () => {
  const state = GameState.getInstance();
  const player = state.getPlayer();
  const tile = state.getLevel().tiles[player.coordinates.y][player.coordinates.x] as Tile;
  if (tile.enemies.length > 0 && tile.enemies[0].life > 0) {
    state.disableInput();
    await new CombatHandler().startCombat(tile.enemies[0]);
    state.enableInput();
  }
};

export {
  navigate,
  returnToDungeon
};