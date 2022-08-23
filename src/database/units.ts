import { koboldSprite } from '../lib/sprites';
import { crocDogSprite } from '../lib/sprites';
import { mudManSprite } from '../lib/sprites';
import { playerSprite } from '../lib/sprites';
import Unit from '../classes/Unit';
import { createNoobSword } from './items';
import { ATTACK } from './abilities';

const createKobold = (): Unit => {
  const unit = new Unit({
    name: 'Kobold',
    level: 1,
    stats: {
      strength: 2,
      dexterity: 4,
      intelligence: 3,
      wisdom: 2,
      constitution: 3
    },
    sprite: koboldSprite,
    meleeAbilities: [ATTACK],
    spells: []
  });
  unit.equipItem(createNoobSword());
  return unit;
};

const createCrocDog = (): Unit => {
  const unit = new Unit({
    name: 'Croc Dog',
    level: 2,
    stats: {
      strength: 5,
      dexterity: 6,
      intelligence: 3,
      wisdom: 2,
      constitution: 4
    },
    sprite: crocDogSprite,
    meleeAbilities: [ATTACK],
    spells: []
  });
  unit.equipItem(createNoobSword());
  return unit;
};

const createMudMan = (): Unit => {
  const unit = new Unit({
    name: 'Mud Man',
    level: 3,
    stats: {
      strength: 8,
      dexterity: 4,
      intelligence: 3,
      wisdom: 2,
      constitution: 6
    },
    sprite: mudManSprite,
    meleeAbilities: [ATTACK],
    spells: []
  });
  unit.equipItem(createNoobSword());
  return unit;
};

const createPlayerUnit = (): Unit => {
  const unit = new Unit({
    name: 'Player Guy',
    level: 1,
    stats: {
      strength: 8,
      dexterity: 8,
      intelligence: 8,
      wisdom: 8,
      constitution: 8
    },
    sprite: playerSprite, // just a placeholder
    meleeAbilities: [ATTACK],
    spells: []
  });
  unit.equipItem(createNoobSword());
  return unit;
};

export {
  createKobold,
  createCrocDog,
  createPlayerUnit,
  createMudMan
};
