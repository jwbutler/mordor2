import { useEffect, useState } from 'react';
import { GameState } from '../classes/GameState';
import { buyItem, type InventoryItem } from '../lib/items';
import { playAudio } from '../lib/sounds';
import styles from './ShopView.module.css';
import shop_png from '../images/gen/shop.png';
import shopkeeper_png from '../images/gen/shopkeeper_shaded.png';
import shopkeeper_what_do_you_want_mp3 from '../sounds/shopkeeper_what_do_you_want.mp3';
import shopkeeper_anything_else_mp3 from '../sounds/shopkeeper_anything_else.mp3';
import shopkeeper_no_gold_mp3 from '../sounds/shopkeeper_no_gold.mp3';
import shopkeeper_come_back_soon_mp3 from '../sounds/shopkeeper_come_back_soon.mp3';
import shopkeeper_thanks_for_nothing_mp3 from '../sounds/shopkeeper_thanks_for_nothing.mp3';

const ShopView = () => {
  const state = GameState.getInstance();
  const items = state.getShop().getItems();

  const [boughtAnything, setBoughtAnything] = useState(false);

  useEffect(() => {
    playAudio(shopkeeper_what_do_you_want_mp3).then(() => {});

    return () => {
      console.log(boughtAnything);
      if (boughtAnything) {
        playAudio(shopkeeper_come_back_soon_mp3).then(() => {});
      } else {
        playAudio(shopkeeper_thanks_for_nothing_mp3).then(() => {});
      }
    };
  }, []);

  const handleExit = async () => {
    state.getPlayer().location = 'town';
  };

  return (
    <div className={styles.shop}>
      <img className={styles.background} src={shop_png} alt="" />
      <img className={styles.background} src={shopkeeper_png} alt="" />
      <div>Shop</div>
      <div className={styles.items}>
        {items.map(item => (
          <ItemView
            item={item}
            price={item.value /* we could consider a markup here */}
            key={item.name}
            onPurchase={() => {
              setBoughtAnything(true);
            }}
          />)
        )}
      </div>
      <button onClick={handleExit}>
        Exit
      </button>
    </div>
  );
};

type ItemProps = {
  item: InventoryItem,
  price: number,
  onPurchase: () => void
};

const ItemView = ({ item, price, onPurchase }: ItemProps) => {
  const onClick = async () => {
    const state = GameState.getInstance();
    const player = state.getPlayer();
    if (player.gold >= price) {
      buyItem(item, price);
      onPurchase();
      await playAudio(shopkeeper_anything_else_mp3);
    } else {
      await playAudio(shopkeeper_no_gold_mp3);
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
