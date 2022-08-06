import { ATTACK, HEAVY_ATTACK } from '../database/abilities';
import { checkNotNull } from '../lib/preconditions';
import { playAudio } from '../lib/sounds';
import { GameState } from './GameState';
import { randBoolean } from '../lib/random';
import Unit from '../classes/Unit';
import { sleep } from '../lib/promises';
import { getAttackDamage, getDodgeChance, getHitChance, getMitigatedDamage } from '../lib/stats';
import { Ability } from '../lib/abilities';

const shortSleepMillis = 150;
const longSleepMillis = 250;

class CombatHandler {
  startCombat = async (enemy: Unit) => {
    const state = GameState.getInstance();
    state.addMessage(`${enemy.name} appeared.`);
    await sleep(shortSleepMillis);
    if (randBoolean()) {
      state.setCombatState({
        attacker: enemy,
        defender: state.getPlayer().unit
      });
      state.setMenu('combat');
      await this.playTurn(ATTACK);
    } else {
      state.setCombatState({
        attacker: state.getPlayer().unit,
        defender: enemy
      });
      state.setMenu('combat');
    }
  };

  playTurn = async (ability: Ability) => {
    const state = GameState.getInstance();
    const combatState = checkNotNull(state.getCombatState());
    const { attacker, defender } = combatState;
    
    await ability.use(attacker, defender);
    await sleep(longSleepMillis);

    if (defender.life <= 0) {
      await sleep(longSleepMillis);
      state.setMenu(null);
      state.setCombatState(null);
    } else {
      state.setCombatState({
        attacker: defender,
        defender: attacker
      });
    }
  };
  
  playTurnPair = async (ability: Ability) => {
    const state = GameState.getInstance();
    await sleep(shortSleepMillis);
    await this.playTurn(ability);
    await sleep(longSleepMillis);
    if (state.getMenu() === 'combat') {
      await this.playTurn(ATTACK);
    }
  };
}

export { CombatHandler };
