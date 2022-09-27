import { InventoryItem } from '../lib/items';
import { checkState } from '../lib/preconditions';

type Session = {
  itemsPurchased: InventoryItem[];
};

class Shop {
  private readonly items: InventoryItem[];
  private session: Session | null;

  constructor() {
    this.items = [];
    this.session = null;
  }

  getItems = () => this.items;
  addItem = (item: InventoryItem) => {
    this.items.push(item);
  };
  removeItem = (item: InventoryItem) => {
    const index = this.items.findIndex(i => i.equals(item));
    this.items.splice(index, 1);
  };
  startSession = () => {
    this.session = {
      itemsPurchased: []
    };
  };
  logItemPurchase = (item: InventoryItem) => {
    checkState(this.session !== null);
    this.session!!.itemsPurchased.push(item);
  };
  purchasedAnyItems = (): boolean => (this.session?.itemsPurchased?.length ?? 0) > 0 ?? false;
  endSession = () => {
    this.session = null;
  };
}

export default Shop;
