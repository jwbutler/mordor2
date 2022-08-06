import Unit from '../classes/Unit';
import { AttackAbility, useAttackAbility } from '../lib/abilities';
import { getAttackDamage, getHitChance } from '../lib/stats';

class Attack implements AttackAbility {
  readonly name = 'Attack';
  readonly manaCost = 0;

  canPayCost = (unit: Unit) => unit.mana >= this.manaCost;
  use = async (unit: Unit, target: Unit) => {
    await useAttackAbility(this, unit, target);
  };

  getDamage = (unit: Unit): number => getAttackDamage(unit);
  getHitChance = (unit: Unit): number => getHitChance(unit);

  getHitMessage = (attacker: Unit, defender: Unit, damage: number): string =>
    `${attacker.name} hits ${defender.name} for ${damage}.`;
  getPreDeathMessage = () => null;
}

class HeavyAttack implements AttackAbility {
  readonly name = 'Attack';
  readonly manaCost = 20;

  canPayCost = (unit: Unit) => unit.mana >= this.manaCost;
  use = async (unit: Unit, target: Unit) => {
    await useAttackAbility(this, unit, target);
  };

  getDamage = (unit: Unit): number => 2 * getAttackDamage(unit);
  getHitChance = (unit: Unit): number => getHitChance(unit);

  getHitMessage = (attacker: Unit, defender: Unit, damage: number): string =>
    `${attacker.name} eviscerates ${defender.name} for ${damage}, spewing gore and entrails everywhere!`;
  getPreDeathMessage = (attacker: Unit, defender: Unit) => 'You land a vicious blow to the enemy’s stomach; '
    + 'the enemy sprawls across the floor, hands clutching vitals and severed spinal cord.';
}

const ATTACK = new Attack();
const HEAVY_ATTACK = new HeavyAttack();

export {
  ATTACK,
  HEAVY_ATTACK
};
