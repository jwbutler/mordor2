import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import { ATTACK, FIREBALL, HEAVY_ATTACK } from '../database/abilities';
import Button from './Button';
import styles from './CombatView.module.css';
import TabBar, { Tab } from './TabBar';
import { Ability } from '../lib/abilities';

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

  const tabs: Tab[] = [
    {
      title: 'Melee',
      content: (
        <div className={styles.buttons}>
          <ActionButton
            ability={ATTACK}
            index={1}
          />
          <ActionButton
            ability={HEAVY_ATTACK}
            index={2}
          />
        </div>
      )
    },
    {
      title: 'Magic',
      content: (
        <div className={styles.buttons}>
          <ActionButton
            ability={FIREBALL}
            index={1}
          />
        </div>
      )
    },
    {
      title: 'Items',
      content: (
        <div className={styles.buttons}>
          <ActionButton
            ability={ATTACK}
            index={1}
          />
          <ActionButton
            ability={HEAVY_ATTACK}
            index={2}
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
  ability: Ability,
  index: number
};

const ActionButton = ({ ability, index }: ActionButtonProps) => {
  const state = GameState.getInstance();
  const playerUnit = state.getPlayer().unit;

  const enabled = state.inputEnabled() && ability.canPayCost(playerUnit);

  const handleClick = async () => {
    if (enabled) {
      state.disableInput();
      await new CombatHandler().playTurnPair(ability);
      state.enableInput();
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      disabled={!enabled}
    >
      {`${index}. ${ability.name} (${ability.getCostText()})`}
    </button>
  );
};
    
export default CombatView;
