import { equipItem, type InventoryItem, type ItemType } from '../lib/items';
import { Stats, zeroStats } from '../lib/stats';
import { titleCase } from '../lib/strings';
import { DamageType } from '../lib/abilities';
import { GameState } from './GameState';

type Props = Readonly<{
  state: GameState,
  name: string,
  value: number,
  slot: EquipmentSlot,
  stats?: Partial<Stats>,
  damage?: number,
  /**
   * Number from 0 to 1 (ratio of damage mitigated)
   */
  mitigation?: Partial<Record<DamageType, number>>,
  /**
   * Number from 0 to 1 (chance to dodge)
   */
  dodgeChance?: number,
  life?: 0,
  mana?: 0
}>;

class Equipment implements InventoryItem {
  private readonly state: GameState;
  readonly type: ItemType = 'equipment';
  readonly value: number;
  readonly name: string;
  readonly slot: EquipmentSlot;
  readonly stats: Stats;
  readonly damage: number;
  /**
   * Number from 0 to 1 (ratio of damage mitigated)
   */
  readonly mitigation: Partial<Record<DamageType, number>>;
  /**
   * Number from 0 to 1 (chance to dodge)
   */
  readonly dodgeChance: number;
  readonly life: 0;
  readonly mana: 0;

  constructor({ state, name, value, slot, stats, damage, mitigation, dodgeChance, life, mana }: Props) {
    this.state = state;
    this.name = name;
    this.value = value;
    this.slot = slot;
    this.stats = { ...zeroStats(), ...stats };
    this.damage = damage ?? 0;
    this.mitigation = mitigation ?? {};
    this.dodgeChance = dodgeChance ?? 0;
    this.life = life ?? 0;
    this.mana = mana ?? 0;
  }

  onUse = () => equipItem(this, this.state);
  equals = (item: InventoryItem) => JSON.stringify(this) === JSON.stringify(item); // should probably do this by hand

  getMitigation(damageType: DamageType): number {
    return this.mitigation[damageType] || 0;
  }
}

type EquipmentSlot = 'mainHand' | 'offHand' | 'head' | 'body' | 'hands' | 'legs' | 'feet';
namespace EquipmentSlot {
  export const values: EquipmentSlot[] = ['mainHand', 'offHand', 'head', 'body', 'hands', 'legs', 'feet'];
  export const toString = (slot: EquipmentSlot): string => {
    switch (slot) {
      case 'mainHand': return 'Main Hand';
      case 'offHand':  return 'Off Hand';
      default:
        return titleCase(slot);
    }
  };
}

export default Equipment;
export { EquipmentSlot };
