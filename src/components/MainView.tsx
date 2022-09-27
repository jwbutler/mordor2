import { ReactNode, useEffect } from 'react';
import { GameState } from '../classes/GameState';
import CharacterView from './CharacterView';
import ControlsView from './ControlsView';
import DungeonView from './DungeonView';
import InventoryView from './InventoryView';
import LevelUpView from './LevelUpView';
import styles from './MainView.module.css';
import ShopView from './ShopView';
import TownView from './TownView';
import TrainerView from './TrainerView';

const MainView = () => {
  const state = GameState.getInstance();
  const location = state.getPlayer().location;

  let content: ReactNode;
  if (state.getMenu() === 'character') {
    content = <CharacterView />;
  } else if (state.getMenu() === 'level_up') {
    content = <LevelUpView />;
  } else if (state.getMenu() === 'inventory') {
    content = <InventoryView />;
  } else if (location === 'dungeon') {
    content = <DungeonView />;
  } else if (location === 'town') {
    content = <TownView />;
  } else if (location === 'shop') {
    content = <ShopView />;
  } else if (location === 'trainer') {
    content = <TrainerView />;
  }

  const showControls = state.getMenu() !== 'character'
    && state.getMenu() !== 'intro'
    && state.getMenu() !== 'inventory'
    && state.getMenu() !== 'level_up'
    && state.getMenu() !== 'combat'
    && state.inputEnabled();

  return (
    <div className={styles.viewport}>
      {content}
      {showControls && <ControlsView />}
    </div>
  );
};

export default MainView;
