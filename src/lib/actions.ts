import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import { Coordinates, move, RelativeDirection, rotate } from './geometry';
import { getTile } from './levels';
import { sleep } from './promises';
import { isDoor, isStairs, isWall, Tile } from './tiles';

const shortSleepMillis = 150; // meh

const navigate = async (relativeDirection: RelativeDirection) => {
  const state = GameState.getInstance();
  if (!state.inputEnabled() || state.getMenu() !== null) {
    return;
  }
  const player = state.getPlayer();
  const playerUnit = player.getUnit();

  switch (player.getLocation()) {
    case 'dungeon':
      const coordinates: Coordinates = (relativeDirection === 'forward')
        ? move(player.coordinates, player.direction)
        : player.coordinates;

      const direction = rotate(player.direction, relativeDirection);

      const nextTile = getTile(state.getLevel(), coordinates);
      if (isDoor(nextTile)) {
        player.moveTo({ location: 'town' });
        if (playerUnit.life < playerUnit.maxLife || playerUnit.mana < playerUnit.maxMana) {
          playerUnit.life = playerUnit.maxLife;
          playerUnit.mana = playerUnit.maxMana;
          state.addMessage('You feel much better.');
        }
      } else if (!isWall(nextTile)) {
        player.coordinates = coordinates;
      }
      player.direction = direction;

      await loadTile();
      playerUnit.actionPoints = Math.min(playerUnit.actionPoints + 1, playerUnit.maxActionPoints);
      return;
    case 'town':
      switch (relativeDirection) {
        case 'backward':
          player.moveTo({
            location: 'dungeon',
            coordinates: state.getLevel().startingPoint,
            direction: state.getLevel().startingDirection
          });
          return;
        case 'forward':
          player.moveTo({ location: 'shop' });
          return;
        case 'right':
          player.moveTo({ location: 'trainer' });
          return;
      }
      break;
    case 'shop':
    case 'trainer':
      switch (relativeDirection) {
        case 'backward':
          player.moveTo({ location: 'town' });
          return;
      }
      break;
  }
};

const returnToDungeon = async () => {
  const state = GameState.getInstance();
  const player = state.getPlayer();
  const level = state.getLevel();
  player.moveTo({
    coordinates: level.startingPoint,
    direction: level.startingDirection,
    location: 'dungeon'
  });
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

const levelUp = async () => {
  const state = GameState.getInstance();
  const playerUnit = state.getPlayer().getUnit();
  playerUnit.experience++;

  if (playerUnit.experience >= playerUnit.experienceToNextLevel) {
    await sleep(shortSleepMillis);
    playerUnit.levelUp();
    state.addMessage(`You leveled up! Welcome to level ${playerUnit.level}.`);
    state.setMenu('level_up');
  }
};

export {
  levelUp,
  navigate,
  returnToDungeon
};
