import { biggerLevel } from './database/levels';
import { createPlayerUnit } from './database/units';
import GameController from './GameController';
import { Level } from './lib/levels';
import { Player } from './lib/player';
import { GameState } from './classes/GameState';
import { Unit } from './lib/units';

const App = () => {  
  const level: Level = biggerLevel();
  const playerUnit: Unit = createPlayerUnit();
  
  const player: Player = {
    unit: playerUnit,
    coordinates: level.startingPoint,
    direction: 'east',
    location: 'dungeon',
    gold: 0
  };
  
  const state = new GameState({ level, player, menu: null });
  GameState.setInstance(state);

  return (
    <GameController />
  );
};

export default App;
