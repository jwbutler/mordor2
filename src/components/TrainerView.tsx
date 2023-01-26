import { useEffect } from 'react';
import { GameState } from '../classes/GameState';
import Trainer from '../classes/Trainer';
import { Ability, MeleeAbility, SpellAbility } from '../lib/abilities';
import { checkState } from '../lib/preconditions';
import { playAudio } from '../lib/sounds';
import styles from './TrainerView.module.css';
import shop_png from '../images/gen/shop.png';
import trainer_png from '../images/gen/trainer_shaded.png';
import shopkeeper_what_do_you_want_mp3 from '../sounds/shopkeeper_what_do_you_want.mp3';
import shopkeeper_anything_else_mp3 from '../sounds/shopkeeper_anything_else.mp3';
import shopkeeper_no_gold_mp3 from '../sounds/shopkeeper_no_gold.mp3';
import shopkeeper_come_back_soon_mp3 from '../sounds/shopkeeper_come_back_soon.mp3';
import shopkeeper_thanks_for_nothing_mp3 from '../sounds/shopkeeper_thanks_for_nothing.mp3';

type Props = Readonly<{
  state: GameState
}>;

const TrainerView = ({ state }: Props) => {
  const trainer = state.getTrainer();
  const abilities = trainer.getAbilities();

  useEffect(() => {
    state.addMessage('"What do you want?"');
    playAudio(shopkeeper_what_do_you_want_mp3, 0).then(() => {});
    trainer.startSession();

    return () => {
      if (trainer.purchasedAnyAbility()) {
        state.addMessage('"Come back soon."');
        playAudio(shopkeeper_come_back_soon_mp3, 0).then(() => {});
      } else {
        state.addMessage('"Thanks for nothin\'."');
        playAudio(shopkeeper_thanks_for_nothing_mp3, 0).then(() => {});
      }
      trainer.endSession();
    };
  }, []);

  const buyAbility = (ability: Ability, price: number) => {
    const player = state.getPlayer();
    const trainer = state.getTrainer();

    checkState(player.gold >= price);
    player.spendGold(price);
    switch (ability.type) {
      case 'melee':
        player.unit.getMeleeAbilities().push(ability as MeleeAbility);
        break;
      case 'spell':
        player.unit.getSpells().push(ability as SpellAbility);
        break;
    }
    trainer.removeAbility(ability);
  };

  const handleExit = async () => {
    state.getPlayer().location = 'town';
  };

  return (
    <div className={styles.trainerView}>
      <img className={styles.background} src={shop_png} alt="" />
      <img className={styles.trainer} src={trainer_png} alt="" />
      <div>Trainer</div>
      <div className={styles.abilities}>
        {abilities.map(ability => (
          <AbilityView
            state={state}
            trainer={state.getTrainer()}
            ability={ability}
            price={100 /* TODO */}
            key={ability.name}
            buyAbility={buyAbility}
          />)
        )}
      </div>
      <button onClick={handleExit}>
        Exit
      </button>
    </div>
  );
};

type AbilityProps = Readonly<{
  state: GameState,
  trainer: Trainer,
  ability: Ability,
  price: number,
  buyAbility: (ability: Ability, price: number) => void
}>;

const AbilityView = ({ state, trainer, ability, price, buyAbility }: AbilityProps) => {
  const onClick = async () => {
    const player = state.getPlayer();
    if (player.gold >= price) {
      buyAbility(ability, price);
      trainer.logAbilityPurchase(ability);
      state.addMessage(`You bought ${ability.name} for ${price} gold.`);
      state.addMessage('"Anything else?"');
      await playAudio(shopkeeper_anything_else_mp3, 0);
    } else {
      state.addMessage('"Come back when you have the dough, ya bum!"');
      await playAudio(shopkeeper_no_gold_mp3, 0);
    }
  };

  return (
    <button
      className={styles.ability}
      onClick={onClick}
    >
      {ability.name} ({price} gold)
    </button>
  );
};

export default TrainerView;
