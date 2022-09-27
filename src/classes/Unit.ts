import { checkState } from '../lib/preconditions';
import { getExperienceToNextLevel, getMaxLife, getMaxMana } from '../lib/stats';
import type { Sprite } from '../lib/sprites';
import type { Stats } from '../lib/stats';
import Equipment, { EquipmentSlot } from './Equipment';
import EnemyController from './EnemyController';
import { AttackSpellAbility, HealingSpellAbility, MeleeAbility } from '../lib/abilities';

type Props = {
  name: string,
  level: number,
  stats: Stats,
  sprite: Sprite,
  meleeAbilities: MeleeAbility[],
  spells: (AttackSpellAbility | HealingSpellAbility)[],
  controller?: EnemyController
};

class Unit {
  readonly name: string;
  level: number;
  readonly stats: Stats;
  life: number;
  maxLife: number;
  mana: number;
  maxMana: number;
  experience: number;
  experienceToNextLevel: number;
  actionPoints: number;
  maxActionPoints: number;
  private readonly equipment: Partial<Record<EquipmentSlot, Equipment>>;
  readonly sprite: Sprite;
  readonly controller: EnemyController | null;

  constructor({ name, level, stats, sprite, controller }: Props) {
    this.name = name;
    this.level = level;
    this.stats = stats;
    this.equipment = {};
    this.experience = 0;
    this.maxLife = getMaxLife(this);
    this.maxMana = getMaxMana(this);
    this.life = this.maxLife;
    this.mana = this.maxMana;
    this.maxActionPoints = 10;
    this.actionPoints = this.maxActionPoints;
    this.experienceToNextLevel = getExperienceToNextLevel(level);
    this.sprite = sprite;
    this.controller = controller ?? null;
  }

  getEquipment = (): Equipment[] => Object.values(this.equipment);
  getEquippedItem = (slot: EquipmentSlot): Equipment | null => this.equipment[slot] || null;
  equipItem = (equipment: Equipment) => {
    checkState(this.getEquippedItem(equipment.slot) === null);
    this.equipment[equipment.slot] = equipment;
  };
  unequipItem = (equipment: Equipment) => {
    this.equipment[equipment.slot] = undefined;
  };

  levelUp = () => {
    this.level++;
    this.experience = 0;
    this.experienceToNextLevel = getExperienceToNextLevel(this.level);
    this.stats.strength++;
    this.stats.dexterity++;
    this.stats.constitution++;
    this.stats.intelligence++;
    this.stats.wisdom++;
    this.maxLife = getMaxLife(this);
    this.maxMana = getMaxMana(this);
    // TODO this.life = this.maxLife? this.mana = this.maxMana?
  };

  takeDamage = (damage: number) => {
    this.life = Math.max(0, this.life - damage);
  };
}

export default Unit;
