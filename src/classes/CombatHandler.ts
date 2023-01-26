import { levelUp } from '../lib/actions';
import { checkNotNull } from '../lib/preconditions';
import { GameState } from './GameState';
import { randBoolean } from '../lib/random';
import Unit from '../classes/Unit';
import { sleep } from '../lib/promises';
import { Ability } from '../lib/abilities';

const shortSleepMillis = 100;
const longSleepMillis = 150;

const chooseEnemyAbility = (enemy: Unit, playerUnit: Unit): Ability => {
  const controller = checkNotNull(enemy.controller);
  return controller.chooseAbility(enemy, playerUnit);
};

type Props = Readonly<{
  state: GameState
}>;

class CombatHandler {
  private readonly state: GameState;

  constructor({ state }: Props) {
    this.state = state;
  }

  startCombat = async (enemy: Unit) => {
    const { state } = this;
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

  endCombat = async () => {
    const { state } = this;
    state.setMenu(null);
    state.setCombatState(null);
    const playerUnit = state.getPlayer().unit;
    if (playerUnit.experience >= playerUnit.experienceToNextLevel) {
      await levelUp(state);
    }
  };

  playTurn = async (unit: Unit, target: Unit, ability: Ability) => {
    const { state } = this;
    const combatState = checkNotNull(state.getCombatState());
    const { attacker, defender } = combatState;

    await ability.use(unit, target, state);
    await sleep(longSleepMillis);

    if (target.life <= 0) {
      await sleep(longSleepMillis);
      await this.endCombat();
    } else {
      // TODO: need to set target here too
      state.setCombatState({
        attacker: defender,
        defender: attacker
      });
    }

    unit.actionPoints = Math.min(unit.actionPoints + 1, unit.maxActionPoints);
  };

  playTurnPair = async (ability: Ability, target: Unit) => {
    const { state } = this;
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
