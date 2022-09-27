import { ATTACK, DOUBLE_ATTACK } from '../database/abilities';
import { checkNotNull } from '../lib/preconditions';
import { GameState } from './GameState';
import { randBoolean } from '../lib/random';
import Unit from '../classes/Unit';
import { sleep } from '../lib/promises';
import { Ability } from '../lib/abilities';

const shortSleepMillis = 150;
const longSleepMillis = 250;

const chooseEnemyAbility = (enemy: Unit, playerUnit: Unit): Ability => {
  const controller = checkNotNull(enemy.controller);
  return controller.chooseAbility(enemy, playerUnit);
};

const endCombat = () => {
  const state = GameState.getInstance();
  state.setMenu(null);
  state.setCombatState(null);
  const playerUnit = state.getPlayer().unit;
  playerUnit.actionPoints = playerUnit.maxActionPoints;
};

class CombatHandler {
  startCombat = async (enemy: Unit) => {
    const state = GameState.getInstance();
    const playerUnit = state.getPlayer().unit;
    state.addMessage(`${enemy.name} appeared.`);
    await sleep(shortSleepMillis);

    if (randBoolean()) {
      state.setCombatState({
        attacker: enemy,
        defender: playerUnit
      });
      state.setMenu('combat');
      const enemyAbility = chooseEnemyAbility(enemy, playerUnit);
      await this.playTurn(enemy, playerUnit, enemyAbility);
    } else {
      state.setCombatState({
        attacker: playerUnit,
        defender: enemy
      });
      state.setMenu('combat');
    }
  };

  playTurn = async (unit: Unit, target: Unit, ability: Ability) => {
    const state = GameState.getInstance();
    const combatState = checkNotNull(state.getCombatState());
    const { attacker, defender } = combatState;
    
    await ability.use(unit, target);
    await sleep(longSleepMillis);

    if (target.life <= 0) {
      await sleep(longSleepMillis);
      endCombat();
    } else {
      // TODO: need to set target here too
      state.setCombatState({
        attacker: defender,
        defender: attacker
      });
    }
  };
  
  playTurnPair = async (ability: Ability, target: Unit) => {
    const state = GameState.getInstance();
    const playerUnit = state.getPlayer().unit;
    const enemyUnit = state.getCombatState()?.defender!!;
    await sleep(shortSleepMillis);
    await this.playTurn(playerUnit, target, ability);
    await sleep(longSleepMillis);
    // to check if the CPU unit isn't dead
    if (state.getMenu() === 'combat') {
      const enemyAbility = chooseEnemyAbility(enemyUnit, playerUnit);
      await this.playTurn(enemyUnit, playerUnit, enemyAbility);
    }
  };
}

export { CombatHandler };
