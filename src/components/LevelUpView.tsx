import { GameState } from '../classes/GameState';
import { Stat, statToString, statValues } from '../lib/stats';
import Button from './Button';
import styles from './LevelUpView.module.css';

const LevelUpView = () => {
  const state = GameState.getInstance();

  return (
    <div className={styles.levelUp}>
      <div>Welcome to level {state.getPlayer().unit.level}!</div>
      <div>Choose a stat to increase:</div>
      {statValues.map(stat => (<IncreaseStatButton stat={stat} key={stat} />))}
    </div>
  );
};

type ButtonProps = {
  stat: Stat
};

const IncreaseStatButton = ({ stat }: ButtonProps) => {
  const state = GameState.getInstance();
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
