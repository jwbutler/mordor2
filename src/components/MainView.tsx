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

type Props = Readonly<{
  state: GameState
}>;

const MainView = ({ state }: Props) => {
  const location = state.getPlayer().location;

  let content: ReactNode;
  if (state.getMenu() === 'character') {
    content = <CharacterView playerUnit={state.getPlayer().unit} />;
  } else if (state.getMenu() === 'level_up') {
    content = <LevelUpView state={state} />;
  } else if (state.getMenu() === 'inventory') {
    content = <InventoryView player={state.getPlayer()} />;
  } else if (location === 'dungeon') {
    content = <DungeonView state={state} />;
  } else if (location === 'town') {
    content = <TownView state={state} />;
  } else if (location === 'shop') {
    content = <ShopView state={state} />;
  } else if (location === 'trainer') {
    content = <TrainerView state={state} />;
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
      {showControls && <ControlsView state={state} />}
    </div>
  );
};

export default MainView;
