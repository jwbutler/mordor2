import Unit from '../classes/Unit';
import { DamageType } from './abilities';
import { titleCase } from './strings';

type Stat =
  /**
   * Directly contributes to damage.  Currently 1:1
   */
  'strength'
  /**
   * Chance to hit, chance to dodge
   */
| 'dexterity'
  /**
   * Spell damage, spell hit chance
   */
| 'intelligence'
  /**
   * Mana / mana regen
   */
| 'wisdom'
  /**
   * Life / life regen
   */
| 'constitution';

type Stats = Record<Stat, number>;

const statValues: Stat[] = ['strength', 'dexterity', 'intelligence', 'wisdom', 'constitution'];

const statToString = (stat: Stat): string => titleCase(stat);

const zeroStats = (): Record<Stat, number> => ({
  strength: 0,
  dexterity: 0,
  intelligence: 0,
  wisdom: 0,
  constitution: 0
});

const strengthToDamage = 1;
const dexterityToHitChance = 0.05;
const constitutionToLife = 10;
const wisdomToMana = 10;

const addStats = (first: Stats, second: Stats): Stats => {
  const combined: Partial<Stats> = {};
  for (const stat of statValues) {
    combined[stat] = first[stat] + second[stat];
  }
  return combined as Stats;
};

const subtractStats = (first: Stats, second: Stats): Stats => {
  const combined: Partial<Stats> = {};
  for (const stat of statValues) {
    combined[stat] = first[stat] - second[stat];
  }
  return combined as Stats;
};

const getModifiedStats = (unit: Unit): Stats => {
  let stats = { ...unit.stats };
  for (const equipment of unit.getEquipment()) {
    stats = addStats(stats, equipment.stats);
  }
  return stats;
};

const getAttackDamage = (attacker: Unit): number => {
  let damage = 0;
  damage += (attacker.stats.strength * strengthToDamage);
  for (const equipment of attacker.getEquipment()) {
    damage += (equipment.stats.strength * strengthToDamage);
    damage += equipment.damage;
  }
  return damage;
};

const getMaxLife = (unit: Unit): number => {
  let life = 0;
  life += (unit.stats.constitution * constitutionToLife);
  for (const equipment of unit.getEquipment()) {
    life += (equipment.stats.constitution * constitutionToLife);
    life += equipment.life;
  }
  return life;
};

const getMaxMana = (unit: Unit): number => {
  let mana = 0;
  mana += (unit.stats.wisdom * wisdomToMana);
  for (const equipment of unit.getEquipment()) {
    mana += (equipment.stats.wisdom * wisdomToMana);
    mana += equipment.mana;
  }
  return mana;
};

const getMitigation = (unit: Unit, damageType: DamageType): number => {
  let mitigation = 0;
  for (const equipment of unit.getEquipment()) {
    mitigation += equipment.getMitigation(damageType);
  }
  return mitigation;
};

const getDodgeChance = (unit: Unit): number => {
  let dodgeChance = 0;
  for (const equipment of unit.getEquipment()) {
    dodgeChance += equipment.dodgeChance;
  }
  return dodgeChance;
};

const getMitigatedDamage = (defender: Unit, incomingDamage: number, damageType: DamageType): number =>
  Math.round(incomingDamage * (1 - getMitigation(defender, damageType)));

const getHitChance = (unit: Unit): number => {
  let hitChance = 0.5;
  hitChance += (unit.stats.dexterity * dexterityToHitChance);
  for (const equipment of unit.getEquipment()) {
    hitChance += (equipment.stats.dexterity * dexterityToHitChance);
  }
  return hitChance;
};

// 4, 5, 6, 7, 8...
const getExperienceToNextLevel = (level: number): number => level + 3;

export type {
  Stat,
  Stats
};

export {
  getAttackDamage,
  getDodgeChance,
  getExperienceToNextLevel,
  getHitChance,
  getMaxLife,
  getMaxMana,
  getMitigatedDamage,
  getModifiedStats,
  statToString,
  statValues,
  subtractStats,
  zeroStats
};
