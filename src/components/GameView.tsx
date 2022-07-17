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

type Props = {
  navigate: (relativeDirection: RelativeDirection) => void;
}

const GameView = ({ navigate }: Props) => {
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
          <MainView navigate={navigate} />
          <MessagesView messages={state.getMessages()} />
          {/* TODO mobile container */}
        </div>
      )}
      <div className={`${styles.column} ${styles.right}`}>
        <UnitView unit={state.getPlayer().unit} player={state.getPlayer()} />
        {state.getMenu() === 'combat'
          ? <CombatView />
          : <MinimapView />
        }
      </div>
    </main>
  );
};

export default GameView;
