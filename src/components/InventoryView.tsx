import { GameState } from '../classes/GameState';
import { InventoryItem } from '../lib/items';
import styles from './InventoryView.module.css';

type Props = {};

const InventoryView = () => {
  const state = GameState.getInstance();
  const items = state.getPlayer().inventory.getItems();
  const equipped = state.getPlayer().unit.getEquipment();

  return (
    <div className={styles.inventory}>
      <h3>Equipped</h3>
      {equipped.map(item => (
        <Item
          key={item.name}
          item={item}
        />
      ))}

      <h3>Inventory</h3>
      {items.map(item => (
        <Item
          key={item.name}
          item={item}
          onClick={item.onUse}
        />
      ))}
    </div>
  );
};

type ItemProps = {
  item: InventoryItem,
  onClick?: () => void
};

const Item = ({ item, onClick }: ItemProps) => {
  const classNames = [styles.item];
  if (onClick) {
    classNames.push(styles.clickable);
  }
  return (
    <div className={classNames.join(' ')} onClick={onClick}>
      {item.name}
    </div>
  );
};
export default InventoryView;
