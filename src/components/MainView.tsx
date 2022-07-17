import { GameState } from '../classes/GameState';
import { RelativeDirection } from '../lib/geometry';
import ControlsView from './ControlsView';
import DungeonView from './DungeonView';
import styles from './MainView.module.css';
import TownView from './TownView';

type Props = {
  navigate: (relativeDirection: RelativeDirection) => void;
  returnToDungeon: () => void;
};

const MainView = ({ navigate, returnToDungeon }: Props) => {
  const state = GameState.getInstance();
  return (
    <div className={styles.viewport}>
      {(state.getPlayer().location === 'dungeon') && (
        <DungeonView />
      )}
      {(state.getPlayer().location === 'town') && (
        <TownView onExit={returnToDungeon} />
      )}
      {state.inputEnabled() && (
        <ControlsView navigate={navigate} />
      )}
    </div>
  );
};

export default MainView;
