import { GameState } from '../classes/GameState';
import Unit from '../classes/Unit';
import { sleep } from './promises';
import { playAudio } from './sounds';
import { getDodgeChance, getMitigatedDamage } from './stats';
import swish_mp3 from '../sounds/swish.mp3';

// copy-pasted, meh
const shortSleepMillis = 150;
const longSleepMillis = 250;

interface Ability {
  name: string;
  canPayCost: (unit: Unit) => boolean;
  use: (unit: Unit, target: Unit) => Promise<void>;
}

interface AttackAbility extends Ability {
  manaCost: number;
  getHitChance: (unit: Unit) => number;
  getDamage: (unit: Unit) => number;
  getHitMessage: (attacker: Unit, defender: Unit, damage: number) => string;
  getPreDeathMessage: (attacker: Unit, defender: Unit) => string | null;
}

const useAttackAbility = async (ability: AttackAbility, attacker: Unit, defender: Unit) => {
  attacker.mana -= ability.manaCost;
  const state = GameState.getInstance();
  const hitChance = ability.getHitChance(attacker);

  if (Math.random() < hitChance) {
    const dodgeChance = getDodgeChance(defender);

    if (Math.random() < dodgeChance) {
      state.addMessage(`${defender.name} dodges ${attacker.name}'s attack.`);
      await playAudio(swish_mp3, longSleepMillis);
    } else {
      await playAudio(attacker.sprite.sounds.attack, longSleepMillis);
      const attackDamage = ability.getDamage(attacker);
      const mitigatedDamage = getMitigatedDamage(defender, attackDamage);
      state.addMessage(ability.getHitMessage(attacker, defender, mitigatedDamage));
      defender.takeDamage(mitigatedDamage);

      if (defender.life <= 0) {
        await sleep(shortSleepMillis);
        await playAudio(defender.sprite.sounds.die, longSleepMillis);
        const preDeathMessage = ability.getPreDeathMessage(attacker, defender);

        if (preDeathMessage) {
          state.addMessage(preDeathMessage);
        }
        state.addMessage(`${defender.name} dies.`);
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
          state.addMessage(`You pick up ${gold} gold.`);
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
    state.addMessage(`${attacker.name} misses ${defender.name}.`);
    await playAudio(swish_mp3, longSleepMillis);
  }
};

export {
  type Ability,
  type AttackAbility,
  useAttackAbility
};
