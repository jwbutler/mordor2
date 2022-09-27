import { Ability } from '../lib/abilities';
import { checkState } from '../lib/preconditions';

type Session = {
  abilitiesPurchased: Ability[];
};

class Trainer {
  private readonly abilities: Ability[];
  private session: Session | null;

  constructor() {
    this.abilities = [];
    this.session = null;
  }

  getAbilities = () => this.abilities;
  addAbility = (ability: Ability) => {
    this.abilities.push(ability);
  };
  removeAbility = (ability: Ability) => {
    const index = this.abilities.indexOf(ability); // direct comparison is ok because they're all singletons
    this.abilities.splice(index, 1);
  };
  startSession = () => {
    this.session = {
      abilitiesPurchased: []
    };
  };
  logAbilityPurchase = (ability: Ability) => {
    checkState(this.session !== null);
    this.session!!.abilitiesPurchased.push(ability);
  };
  purchasedAnyAbility = (): boolean => (this.session?.abilitiesPurchased?.length ?? 0) > 0 ?? false;
  endSession = () => {
    this.session = null;
  };
}

export default Trainer;
