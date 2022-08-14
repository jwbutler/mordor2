import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import { ATTACK, HEAVY_ATTACK } from '../database/abilities';
import Button from './Button';
import styles from './CombatView.module.css';
import TabBar, { Tab } from './TabBar';

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

  const tabs: Tab[] = [
    {
      title: 'Melee',
      content: (
        <div className={styles.buttons}>
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
            disabled={!state.inputEnabled() || !HEAVY_ATTACK.canPayCost(state.getPlayer().unit)}
          >
            Heavy Attack
          </Button>
        </div>
      )
    },
    {
      title: 'Magic',
      content: (
        <div className={styles.buttons}>
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
            disabled={!state.inputEnabled() || !HEAVY_ATTACK.canPayCost(state.getPlayer().unit)}
          >
            Heavy Attack
          </Button>
        </div>
      )
    },
    {
      title: 'Items',
      content: (
        <div className={styles.buttons}>
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
            disabled={!state.inputEnabled() || !HEAVY_ATTACK.canPayCost(state.getPlayer().unit)}
          >
            Heavy Attack
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.combat}>
      <div className={styles.attack}>
        Attack
      </div>
      <TabBar tabs={tabs} />
    </div>
  );
};
    
export default CombatView;
