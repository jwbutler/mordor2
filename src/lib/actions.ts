import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import { Coordinates, move, RelativeDirection, rotate } from './geometry';
import { getTile } from './levels';
import { sleep } from './promises';
import { isDoor, isStairs, isWall, Tile } from './tiles';

const shortSleepMillis = 150; // meh

export const navigate = async (relativeDirection: RelativeDirection) => {
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
      if (isDoor(nextTile)) {
        player.location = 'town';
        if (player.unit.life < player.unit.maxLife || player.unit.mana < player.unit.maxMana) {
          player.unit.life = player.unit.maxLife;
          player.unit.mana = player.unit.maxMana;
          state.addMessage('You feel much better.');
        }
      } else if (!isWall(nextTile)) {
        player.coordinates = coordinates;
      }
      player.direction = direction;

      await loadTile();
      player.unit.actionPoints = Math.min(player.unit.actionPoints + 1, player.unit.maxActionPoints);
      return;
    case 'town':
      switch (relativeDirection) {
        case 'backward':
          player.location = 'dungeon';
          player.coordinates = state.getLevel().startingPoint;
          player.direction = state.getLevel().startingDirection;
          return;
        case 'forward':
          player.location = 'shop';
          return;
        case 'right':
          player.location = 'trainer';
          return;
      }
      break;
    case 'shop':
    case 'trainer':
      switch (relativeDirection) {
        case 'backward':
          player.location = 'town';
          return;
      }
      break;
  }
};

export const returnToDungeon = async () => {
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

export const levelUp = async () => {
  const state = GameState.getInstance();
  const playerUnit = state.getPlayer().unit;
  playerUnit.experience++;

  if (playerUnit.experience >= playerUnit.experienceToNextLevel) {
    await sleep(shortSleepMillis);
    playerUnit.levelUp();
    state.addMessage(`You leveled up! Welcome to level ${playerUnit.level}.`);
    state.setMenu('level_up');
  }
};
