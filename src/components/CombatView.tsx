import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import styles from './CombatView.module.css';

type Props = {
};

// eslint-disable-next-line
const CombatView = ({}: Props) => {
  const state = GameState.getInstance();
  
  const attack = async () => {
    if (state.inputEnabled()) {
      state.disableInput();
      await new CombatHandler().playTurnPair();
      state.enableInput();
    }
  };
  return (
    <div className={styles.combat}>
      <button onClick={attack} disabled={!state.inputEnabled()}>
        Attack
      </button>
      <button disabled>Item</button>
      <button disabled>Run</button>
    </div>
  );
};
    
export default CombatView;
