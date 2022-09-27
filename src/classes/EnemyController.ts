import Unit from './Unit';
import { Ability } from '../lib/abilities';
import { ATTACK } from '../database/abilities';

interface EnemyController {
  chooseAbility(unit: Unit, target: Unit): Ability;
}

class DefaultEnemyController implements EnemyController {
  chooseAbility(unit: Unit, target: Unit): Ability {
    return ATTACK;
  }
}

export default EnemyController;
export { DefaultEnemyController };
