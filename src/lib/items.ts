import Equipment from '../classes/Equipment';
import { GameState } from '../classes/GameState';
import { checkState } from './preconditions';

interface InventoryItem {
  name: string;
  type: ItemType;
  value: number;
  onUse: () => void;
  equals: (item: InventoryItem) => boolean;
}

type ItemType = 'equipment';

const buyItem = (item: InventoryItem, price: number) => {
  const player = GameState.getInstance().getPlayer();
  const shop = GameState.getInstance().getShop();

  checkState(player.gold >= price);
  player.spendGold(price);
  player.inventory.addItem(item);
  shop.removeItem(item);
};

const equipItem = (item: Equipment) => {
  const state = GameState.getInstance();
  const player = state.getPlayer();
  const equippedItem = player.unit.getEquippedItem(item.slot);

  if (equippedItem !== null) {
    player.inventory.addItem(equippedItem);
    player.unit.unequipItem(equippedItem);
  }

  player.inventory.removeItem(item);
  player.unit.equipItem(item);
};

export type {
  InventoryItem,
  ItemType
};

export {
  buyItem,
  equipItem
};
