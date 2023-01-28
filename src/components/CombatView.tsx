import { CombatHandler } from '../classes/CombatHandler';
import { GameState } from '../classes/GameState';
import Unit from '../classes/Unit';
import { ATTACK } from '../database/abilities';
import { Ability } from '../lib/abilities';
import Button from './Button';
import styles from './CombatView.module.css';
import TabBar, { Tab } from './TabBar';

type Props = Readonly<{
  state: GameState,
  render: () => void
}>;

const CombatView = ({ state }: Props) => {
  const playerUnit = state.getPlayer().unit;
  const enemyUnit = state.getCombatState()?.defender!!;

  const attack = async () => {
    if (state.inputEnabled()) {
      state.disableInput();
      await new CombatHandler({ state, render }).playTurnPair(ATTACK, enemyUnit);
      state.enableInput();
    }
  };

  const tabs: Tab[] = [
    {
      title: 'Melee',
      content: (
        <div className={styles.buttons}>
          {playerUnit.getMeleeAbilities().map((ability, i) => {
            return (
              <ActionButton
                state={state}
                ability={ability}
                target={enemyUnit}
                index={i + 1}
                key={ability.name}
              />
            );
          })}
        </div>
      )
    },
    {
      title: 'Magic',
      content: (
        <div className={styles.buttons}>
          {playerUnit.getSpells().map((ability, i) => {
            const target = (ability.targetType === 'enemy' ? enemyUnit : playerUnit);
            return (
              <ActionButton
                state={state}
                ability={ability}
                target={target}
                index={i + 1}
                key={ability.name}
              />
            );
          })}
        </div>
      )
    },
    {
      title: 'Items',
      content: (
        <div>
          TODO
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

type ActionButtonProps = Readonly<{
  state: GameState,
  render: () => void
  ability: Ability,
  target: Unit,
  index: number
}>;

const ActionButton = ({ state, ability, target, index }: ActionButtonProps) => {
  const playerUnit = state.getPlayer().unit;

  const enabled = state.inputEnabled() && ability.canPayCost(playerUnit);

  const handleClick = async () => {
    if (enabled) {
      state.disableInput();
      await new CombatHandler({ state, render }).playTurnPair(ability, target);
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
