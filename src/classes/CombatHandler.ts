import { playAudio } from '../lib/sounds';
import { levelUp } from '../lib/units';
import { GameState } from './GameState';
import { randBoolean } from '../lib/random';
import type { Unit } from '../lib/units';
import { sleep } from '../lib/promises';
import { getAttackDamage, getDodgeChance, getHitChance, getMitigatedDamage } from '../lib/stats';
import { checkNotNull, checkState } from '../lib/preconditions';

const shortSleepMillis = 150;
const longSleepMillis = 250;

const takeDamage = (unit: Unit, damage: number) => {
  unit.life = Math.max(0, unit.life - damage);
};

type Props = {
  state: GameState,
  render: () => void
};

class CombatHandler {
  private readonly state: GameState;
  private readonly render: () => void;
  
  private attacker: Unit | null = null;
  private defender: Unit | null = null;
  
  constructor ({ state, render }: Props) {
    this.state = state;
    this.render = render;
  }

  startCombat = async (enemy: Unit) => {
    const { state, render, attacker, defender } = this;
    state.addMessage(`${enemy.name} appeared.`);
    await sleep(shortSleepMillis);
    if (randBoolean()) {
      this.attacker = enemy;
      this.defender = this.state.getPlayer().unit;
      state.setMenu('combat');
      await this.playTurn();
    } else {
      this.attacker = state.getPlayer().unit;
      this.defender = enemy;
      state.setMenu('combat');
    }
  };

  playTurn = async (): Promise<void> => {
    const { state, render } = this;
    const attacker = checkNotNull(this.attacker);
    const defender = checkNotNull(this.defender);
    await this._attack(attacker, defender);
    await sleep(longSleepMillis);
    await render();

    if (defender.life <= 0) {
      await sleep(longSleepMillis);
      state.setMenu(null);
    } else {
      this.attacker = defender;
      this.defender = attacker;
    }
  };
  
  playTurnPair = async (): Promise<void> => {
    const { state } = this;
    await sleep(shortSleepMillis);
    await this.playTurn();
    await sleep(longSleepMillis);
    if (state.getMenu() === 'combat') {
      await this.playTurn();
    }
  };

  _attack = async (attacker: Unit, defender: Unit) => {
    const { state } = this;
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
            const { x, y } = state.getPlayer().coordinates;
            const tile = state.getLevel().tiles[y][x];
            tile.enemies.splice(tile.enemies.indexOf(defender));
            const gold = 10;
            state.getPlayer().gold += gold;
            state.addMessage(`You picked up ${gold} gold.`);
            playerUnit.experience++;
            if (playerUnit.experience >= playerUnit.experienceToNextLevel) {
              await sleep(shortSleepMillis);
              levelUp(playerUnit);
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
