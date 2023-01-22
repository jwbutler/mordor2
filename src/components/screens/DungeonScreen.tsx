import { GameState } from '../../classes/GameState';
import DungeonView from '../DungeonView';
import UnitView from '../UnitView';
import styles from './DungeonScreen.module.css';

type Props = Readonly<{
}>;

export const DungeonScreen = ({}: Props) => {
  const state = GameState.getInstance();
  return (
    <>
      <DungeonView />
      <div className={styles.unit}>
        <UnitView
          player={state.getPlayer()}
          unit={state.getPlayer().getUnit()}
        />
      </div>
    </>
  );
};
