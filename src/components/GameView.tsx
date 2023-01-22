import { useEffect, useState } from 'react';
import { GameState } from '../classes/GameState';
import CharacterView from './CharacterView';
import IntroView from './IntroView';
import InventoryView from './InventoryView';
import LevelUpView from './LevelUpView';
import MessagesView from './MessagesView';
import CombatScreen from './screens/CombatScreen';
import { DungeonScreen } from './screens/DungeonScreen';
import ShopView from './ShopView';
import TownView from './TownView';
import TrainerView from './TrainerView';
import { Viewport } from './Viewport';
import styles from './GameView.module.css';

type Screen =
  | 'intro'
  | 'character'
  | 'level_up'
  | 'inventory'
  | 'combat'
  | 'dungeon'
  | 'town'
  | 'shop'
  | 'trainer'
  | 'tavern';

const getScreen = (state: GameState): Screen => {
  return state.getMenu() ?? state.getPlayer().getLocation();
};

const renderContent = (state: GameState, screen: Screen) => {
  switch (screen) {
    case 'intro':
      return <IntroView onComplete={() => state.setMenu(null)} />;
    case 'character':
      return <CharacterView />;
    case 'level_up':
      return <LevelUpView />;
    case 'inventory':
      return <InventoryView />;
    case 'combat':
      return <CombatScreen />;
    case 'dungeon':
      return <DungeonScreen />;
    case 'town':
      return <TownView />;
    case 'shop':
      return <ShopView />;
    case 'trainer':
      return <TrainerView />;
    default:
      return <>error</>;
  }
};

const GameView = () => {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const render = () => {
      setTicks(ticks + 1);
    };
    const timer = setInterval(render, 50);
    return () => clearInterval(timer);
  }, [ticks]);

  const state = GameState.getInstance();
  const screen = getScreen(state);
  const content = renderContent(state, screen);
  const messageBar = <MessagesView messages={state.getMessages()} />;

  return (
    <main className={styles.main}>
      <Viewport footer={messageBar}>
        {content}
      </Viewport>
    </main>
  );
};

export default GameView;
