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
  const shop = state.getShop();
  const items = shop.getItems();

  useEffect(() => {
    state.addMessage('"What do you want?"');
    playAudio(shopkeeper_what_do_you_want_mp3, 0).then(() => {});
    shop.startSession();

    return () => {
      if (shop.purchasedAnyItems()) {
        state.addMessage('"Come back soon."');
        playAudio(shopkeeper_come_back_soon_mp3, 0).then(() => {});
      } else {
        state.addMessage('"Thanks for nothin\'."');
        playAudio(shopkeeper_thanks_for_nothing_mp3, 0).then(() => {});
      }
      shop.endSession();
    };
  }, []);

  const handleExit = async () => {
    state.getPlayer().moveTo({ location: 'town' });
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
              shop.logItemPurchase(item);
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
      state.addMessage(`You bought a ${item.name} for ${price} gold.`);
      state.addMessage('"Anything else?"');
      await playAudio(shopkeeper_anything_else_mp3, 0);
    } else {
      state.addMessage('"Come back when you have the dough, ya bum!"');
      await playAudio(shopkeeper_no_gold_mp3, 0);
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
