import { GameState } from '../classes/GameState';
import Player from '../classes/Player';
import { InventoryItem } from '../lib/items';
import styles from './InventoryView.module.css';

type Props = Readonly<{
  player: Player
}>;

const InventoryView = ({ player }: Props) => {
  const items = player.inventory.getItems();
  const equipped = player.unit.getEquipment();

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
