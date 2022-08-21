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
import { playLoop } from '../lib/sounds';
import dungeon_music_mp3 from '../sounds/dungeon_music.mp3';

const GameView = () => {
  const [ticks, setTicks] = useState(0);

  const state = GameState.getInstance();

  useEffect(() => {
    const render = () => {
      setTicks(ticks + 1);
    };
    const timer = setInterval(render, 50);
    return () => clearInterval(timer);
  }, [ticks]);

  useEffect(() => {
    setTimeout(() => {
      playLoop(dungeon_music_mp3).then(() => {});
    }, 3000);
  }, []);

  return (
    <div className={styles.game}>
      <MenuBar />
      <main>
        {(state.getMenu() === 'intro') && (
          <IntroView onComplete={() => state.setMenu(null)} />
        )}
        {(state.getMenu() !== 'intro') && (
          <div className={`${styles.column} ${styles.left}`}>
            <MainView />
            <MessagesView messages={state.getMessages()} />
            {(state.getPlayer().location !== 'town') && (
              <MobileOnly>
                {(state.getMenu() === 'combat') && <CombatView />}
                {(state.getPlayer().location === 'dungeon' && state.getMenu() !== 'combat') && <MinimapView />}
              </MobileOnly>
            )}
          </div>
        )}
        <div className={`${styles.column} ${styles.right}`}>
          <DesktopOnly>
            <UnitView unit={state.getPlayer().unit} player={state.getPlayer()} />
          </DesktopOnly>
          {(state.getMenu() === 'combat') && <CombatView />}
          {(state.getPlayer().location === 'dungeon' && state.getMenu() !== 'combat') && <MinimapView />}
        </div>
      </main>
    </div>
  );
};

export default GameView;
