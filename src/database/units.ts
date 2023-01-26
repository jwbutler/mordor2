import { GameState } from '../classes/GameState';
import { ghoulSprite, koboldSprite, koboldWarriorSprite } from '../lib/sprites';
import { crocDogSprite } from '../lib/sprites';
import { mudManSprite } from '../lib/sprites';
import { playerSprite } from '../lib/sprites';
import Unit from '../classes/Unit';
import { createNoobSword } from './items';
import EnemyController, { DefaultEnemyController } from '../classes/EnemyController';
import { Ability } from '../lib/abilities';
import { ATTACK, DOUBLE_ATTACK } from './abilities';
import { randChoice } from '../lib/random';

export const createKobold = (state: GameState): Unit => {
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
  unit.equipItem(createNoobSword(state));
  return unit;
};

export const createKoboldWarrior = (state: GameState): Unit => {
  const unit = new Unit({
    name: 'Kobold Warrior',
    level: 3,
    stats: {
      strength: 7,
      dexterity: 7,
      intelligence: 2,
      wisdom: 2,
      constitution: 7
    },
    sprite: koboldWarriorSprite,
    meleeAbilities: [ATTACK],
    spells: [],
    controller: new DefaultEnemyController()
  });
  unit.equipItem(createNoobSword(state));
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

export const createCrocDog = (state: GameState): Unit => {
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
    controller: new CrocDogController()
  });
  unit.equipItem(createNoobSword(state));
  return unit;
};

export const createMudMan = (state: GameState): Unit => {
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
  unit.equipItem(createNoobSword(state));
  return unit;
};

export const createPlayerUnit = (state: GameState): Unit => {
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
  unit.equipItem(createNoobSword(state));
  return unit;
};

export const createGhoul = (state: GameState): Unit => {
  const unit = new Unit({
    name: 'Ghoul',
    level: 4,
    stats: {
      strength: 16,
      dexterity: 2,
      intelligence: 6,
      wisdom: 4,
      constitution: 10
    },
    sprite: ghoulSprite,
    meleeAbilities: [ATTACK],
    spells: [],
    controller: new DefaultEnemyController()
  });
  unit.equipItem(createNoobSword(state));
  return unit;
};

export const createRandomEnemy = (state: GameState): Unit => randChoice([
  createCrocDog,
  createGhoul,
  createKobold,
  createKoboldWarrior,
  createMudMan
])(state);
