import { useEffect, useState } from 'react';
import { GameState } from '../classes/GameState';
import CombatView from './CombatView';
import DesktopOnly from './DesktopOnly';
import IntroView from './IntroView';
import MainView from './MainView';
import styles from './GameView.module.css';
import MenuBar from './MenuBar';
import MessagesView from './MessagesView';
import MinimapView from './MinimapView';
import UnitView from './UnitView';
import MobileOnly from './MobileOnly';

type Props = Readonly<{
  state: GameState
}>;

const GameView = ({ state }: Props) => {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const render = () => {
      setTicks(ticks + 1);
    };
    const timer = setInterval(render, 50);
    return () => clearInterval(timer);
  }, [ticks]);

  return (
    <div className={styles.game}>
      <MenuBar state={state} />
      <main>
        {(state.getMenu() === 'intro') && (
          <IntroView onComplete={() => state.setMenu(null)} />
        )}
        {(state.getMenu() !== 'intro') && (
          <div className={`${styles.column} ${styles.left}`}>
            <MainView state={state} />
            <MessagesView messages={state.getMessages()} />
            {(state.getPlayer().location !== 'town') && (
              <MobileOnly>
                {(state.getMenu() === 'combat') && <CombatView state={state} />}
                {(state.getPlayer().location === 'dungeon' && state.getMenu() !== 'combat') && (
                  <MinimapView state={state} />
                )}
              </MobileOnly>
            )}
          </div>
        )}
        <div className={`${styles.column} ${styles.right}`}>
          <DesktopOnly>
            <UnitView unit={state.getPlayer().unit} player={state.getPlayer()} />
          </DesktopOnly>
          {(state.getMenu() === 'combat') && <CombatView state={state} />}
          {(state.getPlayer().location === 'dungeon' && state.getMenu() !== 'combat') && (
            <MinimapView state={state} />
          )}
        </div>
      </main>
    </div>
  );
};

export default GameView;
