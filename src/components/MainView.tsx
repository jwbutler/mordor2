import { GameState } from '../classes/GameState';
import { RelativeDirection } from '../lib/geometry';
import ControlsView from './ControlsView';
import DungeonView from './DungeonView';
import styles from './MainView.module.css';

type Props = {
  navigate: (relativeDirection: RelativeDirection) => void;
};

const MainView = ({ navigate }: Props) => {
  const state = GameState.getInstance();
  return (
    <div className={styles.container}>
      <div className={styles.viewport}>
        {(state.getPlayer().location === 'dungeon') && (
          <DungeonView />
        )}
        {state.inputEnabled() && (
          <ControlsView navigate={navigate} />
        )}
      </div>
    </div>
  );
};

export default MainView;
