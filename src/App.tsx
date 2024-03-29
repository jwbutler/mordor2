import Trainer from './classes/Trainer';
import { FIREBALL, HEAVY_ATTACK, LESSER_HEAL } from './database/abilities';
import { createAwesomeSword, createMediumSword } from './database/items';
import { willLevel } from './database/levels';
import { createPlayerUnit } from './database/units';
import GameController from './GameController';
import { Level } from './lib/levels';
import Player from './classes/Player';
import { GameState } from './classes/GameState';
import Shop from './classes/Shop';
import Unit from './classes/Unit';

const App = () => {
  const level: Level = willLevel();
  const playerUnit: Unit = createPlayerUnit();

  const player = new Player({
    unit: playerUnit,
    coordinates: level.startingPoint,
    direction: level.startingDirection,
    location: 'dungeon'
  });
  player.gold += 100;

  const shop: Shop = new Shop();
  shop.addItem(createMediumSword());
  shop.addItem(createAwesomeSword());

  const trainer: Trainer = new Trainer();
  trainer.addAbility(HEAVY_ATTACK);
  trainer.addAbility(FIREBALL);
  trainer.addAbility(LESSER_HEAL);

  const state = new GameState({ level, player, menu: null, shop, trainer });
  GameState.setInstance(state);

  return (
    <GameController />
  );
};

export default App;
