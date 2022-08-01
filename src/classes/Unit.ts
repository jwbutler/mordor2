import { checkState } from '../lib/preconditions';
import { getExperienceToNextLevel, getMaxLife, getMaxMana } from '../lib/stats';
import type { Sprite } from '../lib/sprites';
import type { Stats } from '../lib/stats';
import Equipment, { EquipmentSlot } from './Equipment';

type Props = {
  name: string,
  level: number,
  stats: Stats,
  sprite: Sprite
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
  private readonly equipment: Partial<Record<EquipmentSlot, Equipment>>;
  readonly sprite: Sprite;

  constructor({ name, level, stats, sprite }: Props) {
    this.name = name;
    this.level = level;
    this.stats = stats;
    this.equipment = {};
    this.experience = 0;
    this.maxLife = getMaxLife(this);
    this.maxMana = getMaxMana(this);
    this.life = this.maxLife;
    this.mana = this.maxMana;
    this.experienceToNextLevel = getExperienceToNextLevel(level);
    this.sprite = sprite;
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
    // TODO this.life = this.maxLife?
  };
}

export default Unit;
