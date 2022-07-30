import { InventoryItem } from '../lib/items';

class Inventory {
  private readonly items: InventoryItem[] = [];

  constructor() {
    this.items = [];
  }

  getItems = () => this.items;
  addItem = (item: InventoryItem) => this.items.push(item);
  removeItem = (item: InventoryItem) => {
    const index = this.items.findIndex(i => i.equals(item));
    this.items.splice(index, 1);
  };
}

export default Inventory;
