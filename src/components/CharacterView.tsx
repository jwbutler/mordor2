/** Not to be confused with UnitView... */
import { GameState } from '../classes/GameState';
import { statToString, statValues } from '../lib/stats';

const CharacterView = () => {
  const state = GameState.getInstance();
  const playerUnit = state.getPlayer().unit;

  return (
    <div>
      {statValues.map(stat => (
        <div key={stat}>
          {`${statToString(stat)}: ${playerUnit.stats[stat]}`}
        </div>
      ))}
    </div>
  );
};

export default CharacterView;
