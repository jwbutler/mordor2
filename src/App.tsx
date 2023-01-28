import { useEffect, useState } from 'react';
import Trainer from './classes/Trainer';
import GameView from './components/GameView';
import { FIREBALL, HEAVY_ATTACK, LESSER_HEAL } from './database/abilities';
import { createAwesomeSword, createMediumSword } from './database/items';
import { willLevel } from './database/levels';
import { createPlayerUnit } from './database/units';
import { handleKeyDown } from './lib/input';
import { Level } from './lib/levels';
import Player from './classes/Player';
import { GameState } from './classes/GameState';
import Shop from './classes/Shop';
import Unit from './classes/Unit';

const App = () => {
  const shop: Shop = new Shop();

  const trainer: Trainer = new Trainer();
  trainer.addAbility(HEAVY_ATTACK);
  trainer.addAbility(FIREBALL);
  trainer.addAbility(LESSER_HEAL);

  const menu = 'intro';
  const state = new GameState({ level: null, player: null, menu, shop, trainer });
  const level: Level = willLevel(state);
  const playerUnit: Unit = createPlayerUnit(state);
  const player = new Player({
    unit: playerUnit,
    coordinates: level.startingPoint,
    direction: level.startingDirection,
    location: 'dungeon'
  });
  player.gold += 100;

  state.setLevel(level);
  state.setPlayer(player);

  shop.addItem(createMediumSword(state));
  shop.addItem(createAwesomeSword(state));

  const onKeyDown = (e: KeyboardEvent) => handleKeyDown(e, state);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <GameView state={state} />
  );
};

export default App;
