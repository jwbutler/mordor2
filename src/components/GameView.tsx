import { useEffect, useState } from 'react';
import { GameState } from '../classes/GameState';
import { RelativeDirection } from '../lib/geometry';
import IntroView from './IntroView';
import MainView from './MainView';
import styles from './GameView.module.css';
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
          <>(MOBILE)</>
        </div>
      )}
      <div className={`${styles.column} ${styles.right}`}>
        <UnitView unit={state.getPlayer().unit} player={state.getPlayer()} />
      </div>
    </main>
  );
};

export default GameView;
