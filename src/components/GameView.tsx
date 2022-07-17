import { useEffect, useState } from 'react';
import { GameState } from '../classes/GameState';
import { RelativeDirection } from '../lib/geometry';
import CombatView from './CombatView';
import IntroView from './IntroView';
import MainView from './MainView';
import styles from './GameView.module.css';
import MessagesView from './MessagesView';
import MinimapView from './MinimapView';
import UnitView from './UnitView';
import MobileOnly from './MobileOnly';

type Props = {
  navigate: (relativeDirection: RelativeDirection) => void,
  returnToDungeon: () => void
}

const GameView = ({ navigate, returnToDungeon }: Props) => {
  const [ticks, setTicks] = useState(0);

  const state = GameState.getInstance();
  
  useEffect(() => {
    const render = () => {
      setTicks(ticks + 1);
    };
    const timer = setInterval(render, 50);
    return () => clearInterval(timer);
  }, [ticks]);

  return (
    <main>
      {(state.getMenu() === 'intro') && (
        <IntroView onComplete={() => state.setMenu(null)} />
      )}
      {(state.getMenu() !== 'intro') && (
        <div className={`${styles.column} ${styles.left}`}>
          <MainView
            navigate={navigate}
            returnToDungeon={returnToDungeon}
          />
          {(state.getPlayer().location !== 'town') && (
            <MessagesView messages={state.getMessages()} />
          )}
          <MobileOnly>
            {(state.getMenu() === 'combat') && <CombatView />}
            {(state.getPlayer().location === 'dungeon' && state.getMenu() !== 'combat') && <MinimapView />}
          </MobileOnly>
        </div>
      )}
      <div className={`${styles.column} ${styles.right}`}>
        <UnitView unit={state.getPlayer().unit} player={state.getPlayer()} />
        {(state.getMenu() === 'combat') && <CombatView />}
        {(state.getPlayer().location === 'dungeon' && state.getMenu() !== 'combat') && <MinimapView />}
      </div>
    </main>
  );
};

export default GameView;
