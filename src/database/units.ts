import { koboldSprite } from '../lib/sprites';
import { crocDogSprite } from '../lib/sprites';
import { mudManSprite } from '../lib/sprites';
import { playerSprite } from '../lib/sprites';
import Unit from '../classes/Unit';
import { createNoobSword } from './items';
import EnemyController, { DefaultEnemyController } from '../classes/EnemyController';
import { Ability } from '../lib/abilities';
import { ATTACK, DOUBLE_ATTACK } from './abilities';

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
    spells: [],
    controller: new DefaultEnemyController()
  });
  unit.equipItem(createNoobSword());
  return unit;
};

class CrocDogController implements EnemyController {
  chooseAbility(unit: Unit, target: Unit): Ability {
    if (unit.life / unit.maxLife <= 0.50) {
      return DOUBLE_ATTACK;
    }
    return ATTACK;
  }
}

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
    meleeAbilities: [ATTACK, DOUBLE_ATTACK],
    spells: [],
    controller: new DefaultEnemyController()
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
    spells: [],
    controller: new DefaultEnemyController()
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
    meleeAbilities: [ATTACK],
    spells: [],
    sprite: playerSprite
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
