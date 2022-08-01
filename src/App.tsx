import { createAwesomeSword, createMediumSword } from './database/items';
import { biggerLevel, manyKobolds } from './database/levels';
import { createPlayerUnit } from './database/units';
import GameController from './GameController';
import { Level } from './lib/levels';
import Player from './classes/Player';
import { GameState } from './classes/GameState';
import Shop from './classes/Shop';
import Unit from './classes/Unit';

const App = () => {  
  const level: Level = biggerLevel();
  const playerUnit: Unit = createPlayerUnit();

  const player = new Player({
    unit: playerUnit,
    coordinates: level.startingPoint,
    direction: level.startingDirection,
    location: 'dungeon'
  });
  player.gold += 50;

  const shop: Shop = new Shop();
  shop.addItem(createMediumSword());
  shop.addItem(createAwesomeSword());
  
  const state = new GameState({ level, player, menu: null, shop });
  GameState.setInstance(state);

  return (
    <GameController />
  );
};

export default App;
