import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import { ATTACK, FIREBALL, HEAVY_ATTACK, LESSER_HEAL } from '../database/abilities';
import Button from './Button';
import styles from './CombatView.module.css';
import TabBar, { Tab } from './TabBar';
import { Ability } from '../lib/abilities';
import Unit from '../classes/Unit';

// eslint-disable-next-line
const CombatView = () => {
  const state = GameState.getInstance();
  const enemyUnit = state.getCombatState()?.defender!!;

  const attack = async () => {
    if (state.inputEnabled()) {
      state.disableInput();
      await new CombatHandler().playTurnPair(ATTACK, enemyUnit);
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
            target={enemyUnit}
            index={1}
          />
          <ActionButton
            ability={HEAVY_ATTACK}
            target={enemyUnit}
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
            target={enemyUnit}
            index={1}
          />
          <ActionButton
            ability={LESSER_HEAL}
            target={state.getPlayer().unit}
            index={2}
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
            target={enemyUnit}
            index={1}
          />
          <ActionButton
            ability={HEAVY_ATTACK}
            target={enemyUnit}
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
  target: Unit,
  index: number
};

const ActionButton = ({ ability, target, index }: ActionButtonProps) => {
  const state = GameState.getInstance();
  const playerUnit = state.getPlayer().unit;

  const enabled = state.inputEnabled() && ability.canPayCost(playerUnit);

  const handleClick = async () => {
    if (enabled) {
      state.disableInput();
      await new CombatHandler().playTurnPair(ability, target);
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
