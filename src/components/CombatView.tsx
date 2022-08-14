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
          <ActionButton
            onClick={attack}
            disabled={!state.inputEnabled()}
            label="1. Attack"
          />
          <ActionButton
            onClick={heavyAttack}
            disabled={!state.inputEnabled() || !HEAVY_ATTACK.canPayCost(state.getPlayer().unit)}
            label="2. Heavy Attack"
          />
        </div>
      )
    },
    {
      title: 'Magic',
      content: (
        <div className={styles.buttons}>
          <ActionButton
            onClick={attack}
            disabled={!state.inputEnabled()}
            label="1. Attack"
          />
          <ActionButton
            onClick={heavyAttack}
            disabled={!state.inputEnabled() || !HEAVY_ATTACK.canPayCost(state.getPlayer().unit)}
            label="2. Heavy Attack"
          />
        </div>
      )
    },
    {
      title: 'Items',
      content: (
        <div className={styles.buttons}>
          <ActionButton
            onClick={attack}
            disabled={!state.inputEnabled()}
            label="1. Attack"
          />
          <ActionButton
            onClick={heavyAttack}
            disabled={!state.inputEnabled() || !HEAVY_ATTACK.canPayCost(state.getPlayer().unit)}
            label="2. Heavy Attack"
          />
        </div>
      )
    }
  ];

  return (
    <div className={styles.combat}>
      <Button
        onClick={attack}
        disabled={!state.inputEnabled()}
      >
        Attack
      </Button>
      <TabBar tabs={tabs} />
    </div>
  );
};

type ActionButtonProps = {
  label: string,
  disabled: boolean,
  onClick: () => void
};

const ActionButton = ({ label, disabled, onClick }: ActionButtonProps) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
    
export default CombatView;
