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
  damage: 4,
  value: 100
});

export {
  createNoobSword,
  createMediumSword
};
