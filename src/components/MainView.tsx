import { ReactNode } from 'react';
import { GameState } from '../classes/GameState';
import ControlsView from './ControlsView';
import DungeonView from './DungeonView';
import InventoryView from './InventoryView';
import styles from './MainView.module.css';
import ShopView from './ShopView';
import TownView from './TownView';

const MainView = () => {
  const state = GameState.getInstance();
  let content: ReactNode;
  const location = state.getPlayer().location;

  if (state.getMenu() === 'inventory') {
    content = <InventoryView />;
  } else if (location === 'dungeon') {
    content = <DungeonView />;
  } else if (location === 'town') {
    content = <TownView />;
  } else if (location === 'shop') {
    content = <ShopView />;
  }

  const showControls = state.getMenu() !== 'intro'
    && state.getMenu() !== 'inventory'
    && state.inputEnabled();

  return (
    <div className={styles.viewport}>
      {content}
      {showControls && <ControlsView />}
    </div>
  );
};

export default MainView;
