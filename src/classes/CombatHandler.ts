import { checkNotNull } from '../lib/preconditions';
import { playAudio } from '../lib/sounds';
import { GameState } from './GameState';
import { randBoolean } from '../lib/random';
import Unit from '../classes/Unit';
import { sleep } from '../lib/promises';
import { getAttackDamage, getDodgeChance, getHitChance, getMitigatedDamage } from '../lib/stats';

const shortSleepMillis = 150;
const longSleepMillis = 250;

const takeDamage = (unit: Unit, damage: number) => {
  unit.life = Math.max(0, unit.life - damage);
};

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
      await this.playTurn();
    } else {
      state.setCombatState({
        attacker: state.getPlayer().unit,
        defender: enemy
      });
      state.setMenu('combat');
    }
  };

  playTurn = async () => {
    const state = GameState.getInstance();
    const combatState = checkNotNull(state.getCombatState());
    const { attacker, defender } = combatState;
    
    await this._attack(attacker, defender);
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
  
  playTurnPair = async () => {
    const state = GameState.getInstance();
    await sleep(shortSleepMillis);
    await this.playTurn();
    await sleep(longSleepMillis);
    if (state.getMenu() === 'combat') {
      await this.playTurn();
    }
  };

  _attack = async (attacker: Unit, defender: Unit) => {
    const state = GameState.getInstance();
    const hitChance = getHitChance(attacker);
    if (Math.random() < hitChance) {
      const dodgeChance = getDodgeChance(defender);
      if (Math.random() < dodgeChance) {
        state.addMessage(`${defender.name} dodged ${attacker.name}'s attack.`);
      } else {
        await playAudio(attacker.sprite.sounds.attack);
        const attackDamage = getAttackDamage(attacker);
        const mitigatedDamage = getMitigatedDamage(defender, attackDamage);
        state.addMessage(`${attacker.name} hit ${defender.name} for ${mitigatedDamage}.`);
        takeDamage(defender, mitigatedDamage);

        if (defender.life <= 0) {
          await sleep(shortSleepMillis);
          await playAudio(defender.sprite.sounds.die);
          state.addMessage(`${defender.name} died.`);
          const playerUnit = state.getPlayer().unit;

          if (defender === playerUnit) {
            alert('GAME OVER!');
          } else {
            await sleep(shortSleepMillis);
            const { x, y } = state.getPlayer().coordinates;
            const tile = state.getLevel().tiles[y][x];
            tile.enemies.splice(tile.enemies.indexOf(defender));
            const gold = 10;
            state.getPlayer().gold += gold;
            state.addMessage(`You picked up ${gold} gold.`);
            playerUnit.experience++;

            if (playerUnit.experience >= playerUnit.experienceToNextLevel) {
              await sleep(shortSleepMillis);
              playerUnit.levelUp();
              state.addMessage(`You leveled up! Welcome to level ${playerUnit.level}.`);
            }
          }
        }
      }
    } else {
      state.addMessage(`${attacker.name} missed ${defender.name}.`);
    }
  };
}

export { CombatHandler };
