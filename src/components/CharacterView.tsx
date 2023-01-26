/** Not to be confused with UnitView... */
import Unit from '../classes/Unit';
import { statToString, statValues } from '../lib/stats';

type Props = Readonly<{
  playerUnit: Unit
}>;

const CharacterView = ({ playerUnit }: Props) => {
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
