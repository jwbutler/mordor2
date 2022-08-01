import Equipment from '../classes/Equipment';

const createNoobSword = (): Equipment => new Equipment({
  name: 'Noob Sword',
  slot: 'mainHand',
  damage: 2,
  value: 10
});

const createMediumSword = (): Equipment => new Equipment({
  name: 'Medium Sword',
  slot: 'mainHand',
  stats: { dexterity: 2 },
  damage: 5,
  value: 100
});

const createAwesomeSword = (): Equipment => new Equipment({
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
