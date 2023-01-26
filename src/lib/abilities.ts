import { GameState } from '../classes/GameState';
import Unit from '../classes/Unit';
import { sleep } from './promises';
import { playAudio } from './sounds';
import { getDodgeChance, getMitigatedDamage } from './stats';
import swish_mp3 from '../sounds/swish.mp3';

// copy-pasted, meh
const shortSleepMillis = 150;
const longSleepMillis = 250;

type AbilityType = 'melee' | 'spell';
type DamageType = 'physical' | 'elemental';

interface Ability {
  readonly name: string;
  readonly type: AbilityType;
  readonly targetType: AbilityTargetType;
  readonly canPayCost: (unit: Unit) => boolean;
  readonly use: (unit: Unit, target: Unit, state: GameState) => Promise<void>;
  readonly getCostText: () => string;
}

abstract class AbstractAbility implements Ability {
  abstract readonly name: string;
  abstract readonly type: AbilityType;
  abstract readonly targetType: AbilityTargetType;
  abstract readonly canPayCost: (unit: Unit) => boolean;
  abstract readonly use: (unit: Unit, target: Unit, state: GameState) => Promise<void>;
  abstract readonly getCostText: () => string;
}

abstract class MeleeAbility extends AbstractAbility {
  readonly type: AbilityType = 'melee';
  abstract readonly damageType: DamageType;
  abstract readonly actionPointCost: number;
  abstract readonly getHitChance: (unit: Unit) => number;
  abstract readonly getDamage: (unit: Unit) => number;
  abstract readonly getHitMessage: (attacker: Unit, defender: Unit, damage: number) => string;
  abstract readonly getPreDeathMessage: (attacker: Unit, defender: Unit) => string | null;
}

abstract class SpellAbility extends AbstractAbility {
  readonly type: AbilityType = 'spell';
  abstract readonly manaCost: number;
}

abstract class AttackSpellAbility extends SpellAbility {
  abstract readonly damageType: DamageType;
  abstract readonly getHitChance: (unit: Unit) => number;
  abstract readonly getDamage: (unit: Unit) => number;
  abstract readonly getHitMessage: (attacker: Unit, defender: Unit, damage: number) => string;
  abstract readonly getPreDeathMessage: (attacker: Unit, defender: Unit) => string | null;
  abstract readonly getSound: () => string;
}

abstract class HealingSpellAbility extends SpellAbility {
  abstract readonly manaCost: number;
  abstract readonly getSuccessChance: (caster: Unit) => number;
  abstract readonly getHealAmount: (caster: Unit) => number;
  abstract readonly getSuccessMessage: (caster: Unit, target: Unit, healAmount: number) => string;
  abstract readonly getSound: () => string;
}

type AbilityTargetType = 'self' | 'enemy';

export const useMeleeAbility = async (ability: MeleeAbility, attacker: Unit, defender: Unit, state: GameState) => {
  const hitChance = ability.getHitChance(attacker);

  if (Math.random() < hitChance) {
    const dodgeChance = getDodgeChance(defender);

    if (Math.random() < dodgeChance) {
      state.addMessage(`${defender.name} dodges ${attacker.name}'s attack.`);
      await playAudio(swish_mp3, longSleepMillis);
    } else {
      await playAudio(attacker.sprite.sounds.attack, longSleepMillis);
      const attackDamage = ability.getDamage(attacker);
      const mitigatedDamage = getMitigatedDamage(defender, attackDamage, ability.damageType);
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
        }
      }
    }
  } else {
    state.addMessage(`${attacker.name} misses ${defender.name}.`);
    await playAudio(swish_mp3, longSleepMillis);
  }
};

const useAttackSpellAbility = async (ability: AttackSpellAbility, attacker: Unit, defender: Unit, state: GameState) => {
  const hitChance = ability.getHitChance(attacker);

  if (Math.random() < hitChance) {
    const dodgeChance = getDodgeChance(defender);

    if (Math.random() < dodgeChance) {
      state.addMessage(`${defender.name} dodges ${attacker.name}'s attack.`);
      await playAudio(swish_mp3, longSleepMillis);
    } else {
      await playAudio(ability.getSound(), longSleepMillis);
      const attackDamage = ability.getDamage(attacker);
      const mitigatedDamage = getMitigatedDamage(defender, attackDamage, ability.damageType);
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
        }
      }
    }
  } else {
    state.addMessage(`${attacker.name} misses ${defender.name}.`);
    await playAudio(swish_mp3, longSleepMillis);
  }
};

const useHealingSpellAbility = async (ability: HealingSpellAbility, caster: Unit, target: Unit, state: GameState) => {
  const successChance = ability.getSuccessChance(caster);

  if (Math.random() < successChance) {
    await playAudio(ability.getSound(), longSleepMillis);
    const healAmount = ability.getHealAmount(caster);
    state.addMessage(ability.getSuccessMessage(caster, target, healAmount));
    target.life = Math.min(target.maxLife, target.life + healAmount);
  } else {
    state.addMessage(`${caster.name} fails to heal ${caster.name}.`);
  }
};

export {
  type Ability,
  type AbilityTargetType,
  type AbilityType,
  type DamageType,
  AttackSpellAbility,
  HealingSpellAbility,
  MeleeAbility,
  SpellAbility,
  useAttackSpellAbility,
  useHealingSpellAbility
};
