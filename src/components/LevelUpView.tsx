import { GameState } from '../classes/GameState';
import { Stat, statToString, statValues } from '../lib/stats';
import Button from './Button';
import styles from './LevelUpView.module.css';

type Props = Readonly<{
  state: GameState
}>;

const LevelUpView = ({ state }: Props) => {
  const player = state.getPlayer();
  return (
    <div className={styles.levelUp}>
      <div>Welcome to level {player.unit.level}!</div>
      <div>Choose a stat to increase:</div>
      {statValues.map(stat => (
        <IncreaseStatButton
          stat={stat}
          state={state}
          key={stat}
        />
      ))}
    </div>
  );
};

type ButtonProps = {
  stat: Stat,
  state: GameState
};

const IncreaseStatButton = ({ stat, state }: ButtonProps) => {
  const playerUnit = state.getPlayer().unit;
  const handleClick = () => {
    if (confirm(`Are you sure you want to increase ${stat}?`)) {
      playerUnit.increaseStat(stat);
      state.setMenu(null);
    }
  };

  return (
    <Button
      className={styles.stat}
      onClick={handleClick}
    >
      {statToString(stat)} ({`${playerUnit.stats[stat]} -> ${playerUnit.stats[stat] + 1}`})
    </Button>
  );
};

export default LevelUpView;
