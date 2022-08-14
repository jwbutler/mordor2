import Unit from '../classes/Unit';
import { AttackAbility, AttackSpellAbility, useAttackAbility, useSpellAttackAbility } from '../lib/abilities';
import { getAttackDamage, getHitChance } from '../lib/stats';

class Attack implements AttackAbility {
  readonly name = 'Attack';
  readonly actionPointCost = 0;
  readonly damageType = 'physical';

  canPayCost = (unit: Unit) => unit.actionPoints >= this.actionPointCost;
  use = async (unit: Unit, target: Unit) => {
    await useAttackAbility(this, unit, target);
  };

  getDamage = (unit: Unit): number => getAttackDamage(unit);
  getHitChance = (unit: Unit): number => getHitChance(unit);

  getHitMessage = (attacker: Unit, defender: Unit, damage: number): string =>
    `${attacker.name} hits ${defender.name} for ${damage}.`;
  getPreDeathMessage = () => null;

  getCostText = () => `${this.actionPointCost} AP`;
}

class HeavyAttack implements AttackAbility {
  readonly name = 'Heavy Attack';
  readonly actionPointCost = 5;
  readonly damageType = 'physical';

  canPayCost = (unit: Unit) => unit.actionPoints >= this.actionPointCost;
  use = async (unit: Unit, target: Unit) => {
    await useAttackAbility(this, unit, target);
  };

  getDamage = (unit: Unit): number => 2 * getAttackDamage(unit);
  getHitChance = (unit: Unit): number => getHitChance(unit);

  getHitMessage = (attacker: Unit, defender: Unit, damage: number): string =>
    `${attacker.name} eviscerates ${defender.name} for ${damage}, spewing gore and entrails everywhere!`;
  getPreDeathMessage = (attacker: Unit, defender: Unit) => 'You land a vicious blow to the enemy’s stomach; '
    + 'the enemy sprawls across the floor, hands clutching vitals and severed spinal cord.';

  getCostText = () => `${this.actionPointCost} AP`;
}

class Fireball implements AttackSpellAbility {
  readonly name = 'Fireball';
  readonly manaCost = 15;
  readonly damageType = 'elemental';

  canPayCost = (unit: Unit) => unit.mana >= this.manaCost;
  use = async (unit: Unit, target: Unit) => {
    await useSpellAttackAbility(this, unit, target);
  };

  getDamage = (unit: Unit): number => 15;
  getHitChance = (unit: Unit): number => getHitChance(unit);

  getHitMessage = (attacker: Unit, defender: Unit, damage: number): string =>
    `${attacker.name}'s fireball deals ${damage} to ${defender.name}!`;
  getPreDeathMessage = (attacker: Unit, defender: Unit) => `${defender.name} bursts into flame and screams in agony as they are burned alive!`;

  getCostText = () => `${this.manaCost} MP`;
}

const ATTACK = new Attack();
const HEAVY_ATTACK = new HeavyAttack();
const FIREBALL = new Fireball();

export {
  ATTACK,
  HEAVY_ATTACK,
  FIREBALL
};
