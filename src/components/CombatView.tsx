import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import Button from './Button';
import styles from './CombatView.module.css';

// eslint-disable-next-line
const CombatView = () => {
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
      <Button
        className={styles.button}
        onClick={attack}
        disabled={!state.inputEnabled()}
      >
        Attack
      </Button>
      <Button className={styles.button} disabled>
        Item
      </Button>
      <Button className={styles.button} disabled>
        Run
      </Button>
    </div>
  );
};
    
export default CombatView;
