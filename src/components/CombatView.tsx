import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import { ATTACK, HEAVY_ATTACK } from '../database/abilities';
import Button from './Button';
import styles from './CombatView.module.css';

// eslint-disable-next-line
const CombatView = () => {
  const state = GameState.getInstance();
  
  const attack = async () => {
    if (state.inputEnabled()) {
      state.disableInput();
      await new CombatHandler().playTurnPair(ATTACK);
      state.enableInput();
    }
  };

  const heavyAttack = async () => {
    if (state.inputEnabled()) {
      state.disableInput();
      await new CombatHandler().playTurnPair(HEAVY_ATTACK);
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
      <Button
        className={styles.button}
        onClick={heavyAttack}
        disabled={!state.inputEnabled()}
      >
        Heavy Attack
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
