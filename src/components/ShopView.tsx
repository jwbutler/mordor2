import { GameState } from '../classes/GameState';
import { buyItem, type InventoryItem } from '../lib/items';
import styles from './ShopView.module.css';

const ShopView = () => {
  const state = GameState.getInstance();
  const items = state.getShop().getItems();

  return (
    <div className={styles.shop}>
      <div>Shop</div>
      <div className={styles.items}>
        {items.map(item => (
          <ItemView
            item={item}
            price={item.value /* we could consider a markup here */}
            key={item.name}
          />)
        )}
      </div>
      <button onClick={() => { state.getPlayer().location = 'town'; }}>
        Exit
      </button>
    </div>
  );
};

type ItemProps = {
  item: InventoryItem,
  price: number
};

const ItemView = ({ item, price }: ItemProps) => {
  const onClick = () => {
    const state = GameState.getInstance();
    const player = state.getPlayer();
    if (player.gold >= price) {
      buyItem(item, price);
    }
  };

  return (
    <button
      className={styles.item}
      onClick={onClick}
    >
      {item.name} ({price} gold)
    </button>
  );
};

export default ShopView;
