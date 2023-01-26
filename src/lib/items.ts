import Equipment from '../classes/Equipment';
import { GameState } from '../classes/GameState';
import { checkState } from './preconditions';

export interface InventoryItem {
  name: string;
  type: ItemType;
  value: number;
  onUse: () => void;
  equals: (item: InventoryItem) => boolean;
}

export type ItemType = 'equipment';

export const buyItem = (item: InventoryItem, price: number, state: GameState) => {
  const player = state.getPlayer();
  const shop = state.getShop();

  checkState(player.gold >= price);
  player.spendGold(price);
  player.inventory.addItem(item);
  shop.removeItem(item);
};

export const equipItem = (item: Equipment, state: GameState) => {
  const player = state.getPlayer();
  const equippedItem = player.unit.getEquippedItem(item.slot);

  if (equippedItem !== null) {
    player.inventory.addItem(equippedItem);
    player.unit.unequipItem(equippedItem);
  }

  player.inventory.removeItem(item);
  player.unit.equipItem(item);
};
