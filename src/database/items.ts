import Equipment from '../classes/Equipment';
import { GameState } from '../classes/GameState';

const createNoobSword = (state: GameState): Equipment => new Equipment({
  state,
  name: 'Noob Sword',
  slot: 'mainHand',
  damage: 2,
  value: 10
});

const createMediumSword = (state: GameState): Equipment => new Equipment({
  state,
  name: 'Medium Sword',
  slot: 'mainHand',
  stats: { dexterity: 2 },
  damage: 5,
  value: 100
});

const createAwesomeSword = (state: GameState): Equipment => new Equipment({
  state,
  name: 'Awesome Sword',
  slot: 'mainHand',
  stats: { dexterity: 4, constitution: 4 },
  damage: 12,
  value: 1000
});

export {
  createNoobSword,
  createMediumSword,
  createAwesomeSword
};
