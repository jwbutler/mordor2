import { useEffect } from 'react';
import { CombatHandler } from './classes/CombatHandler';
import { GameState } from './classes/GameState';
import GameView from './components/GameView';
import { move, navigate, RelativeDirection } from './lib/geometry';
import { getRelativeDirection } from './lib/input';
import { getTile } from './lib/levels';
import { isDoorFacingDirection, isStairs, isWallLike, Tile } from './lib/tiles';

const GameController = () => {
  const state = GameState.getInstance();

  const handleKeyDown = async (e: KeyboardEvent) => {
    const relativeDirection = getRelativeDirection(e);
    if (relativeDirection) {
      await handleNavigate(relativeDirection);
    }
  };

  const loadTile = async (tile: Tile) => {
    if (tile.enemies.length > 0 && tile.enemies[0].life > 0) {
      state.disableInput();
      await new CombatHandler().startCombat(tile.enemies[0]);
      state.enableInput();
    }
  };
  
  const handleNavigate = async (relativeDirection: RelativeDirection) => {
    if (!state.inputEnabled() || state.getMenu() !== null) {
      return;
    }
    
    // playAudio('footstep');
    const player = state.getPlayer();

    const { coordinates, direction } = navigate({
      coordinates: player.coordinates,
      compassDirection: player.direction,
      relativeDirection
    });

    const nextTile = getTile(state.getLevel(), coordinates);
    if (isDoorFacingDirection(nextTile, direction)) {
      player.coordinates = move(coordinates, direction); // assume the developer put a floor tile there...
    } else if (isStairs(nextTile)) {
      player.location = 'town';
      player.coordinates = { x: 0, y: 0 };
      if (player.unit.life < player.unit.maxLife || player.unit.mana < player.unit.maxMana) {
        player.unit.life = player.unit.maxLife;
        player.unit.mana = player.unit.maxMana;
        state.addMessage('You feel much better.');
      }
    } else if (!isWallLike(nextTile, direction)) {
      player.coordinates = coordinates;
    }
    player.direction = direction;

    const tile = state.getLevel().tiles[player.coordinates.y][player.coordinates.x] as Tile;
    await loadTile(tile);
  };

  const returnToDungeon = () => {
    state.getPlayer().location = 'dungeon';
    state.getPlayer().coordinates = { ...state.getLevel().startingPoint };
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line
  }, []);
  
  return (
    <GameView
      navigate={handleNavigate}
      returnToDungeon={returnToDungeon}
    />
  );
};

export default GameController;
