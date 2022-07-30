import Player from '../classes/Player';
import Unit from '../classes/Unit';
import ResourceMeter from './ResourceMeter';
import styles from './UnitView.module.css';

type Props = {
  unit: Unit,
  player: Player
};

const UnitView = ({ unit, player }: Props) => {
  return (
    <table className={styles.unit}>
      <tbody>
        <tr>
          <td>Name</td>
          <td>{unit.name}</td>
        </tr>
        <tr>
          <td>Level</td>
          <td>{unit.level}</td>
        </tr>
        <tr>
          <td>Experience</td>
          <td>
            <div className={styles.meter}>
              <ResourceMeter
                type="experience"
                current={unit.experience}
                max={unit.experienceToNextLevel}
              />
            </div>
            <div>{unit.experience}/{unit.experienceToNextLevel}</div>
          </td>
        </tr>
        <tr>
          <td>Life</td>
          <td>
            <div className={styles.meter}>
              <ResourceMeter
                type="life"
                current={unit.life}
                max={unit.maxLife}
              />
            </div>
            <div>{unit.life}/{unit.maxLife}</div>
          </td>
        </tr>
        <tr>
          <td>Mana</td>
          <td>
            <div className={styles.meter}>
              <ResourceMeter
                type="mana"
                current={unit.mana}
                max={unit.maxMana}
              />
            </div>
            <div>{unit.mana}/{unit.maxMana}</div>
          </td>
        </tr>
        <tr>
          <td>Gold</td>
          <td>{player.gold}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default UnitView;
