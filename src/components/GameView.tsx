import { ReactNode, useEffect, useState } from 'react';
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
          <>
            <Panel type="top-left">
              <MainView state={state} />
            </Panel>
            <Panel type="bottom-left">
              <MessagesView messages={state.getMessages()} />
            </Panel>
            <Panel type="top-right">
              <UnitView unit={state.getPlayer().unit} player={state.getPlayer()} />
            </Panel>
            <Panel type="bottom-right">
              {(state.getMenu() === 'combat') && <CombatView state={state} />}
              {(state.getPlayer().location === 'dungeon' && state.getMenu() !== 'combat') && (
                <MinimapView state={state} width={7} height={5} />
              )}
            </Panel>
          </>
        )}
      </main>
    </div>
  );
};

type PanelType = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';
type PanelProps = {
  type: PanelType,
  children: ReactNode
};

const Panel = ({ type, children }: PanelProps) => {
  return (
    <div className={`${styles.panel} ${styles[type]}`}>
      {children}
    </div>
  );
};

export default GameView;
