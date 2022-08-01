import type { Coordinates, CompassDirection } from '../lib/geometry';
import { checkState } from '../lib/preconditions';
import Unit from '../classes/Unit';
import type { Location } from '../lib/location';
import Inventory from './Inventory';

type Props = {
  unit: Unit,
  location: Location,
  coordinates: Coordinates,
  direction: CompassDirection,
};

class Player {
  readonly unit: Unit;
  location: Location;
  coordinates: Coordinates;
  direction: CompassDirection;
  gold: number;
  inventory: Inventory;

  constructor({ unit, location, coordinates, direction }: Props) {
    this.unit = unit;
    this.location = location;
    this.coordinates = coordinates;
    this.direction = direction;
    this.gold = 0;
    this.inventory = new Inventory();
  }

  spendGold = (amount: number) => {
    checkState(this.gold >= amount);
    this.gold -= amount;
  };
}

export default Player;
