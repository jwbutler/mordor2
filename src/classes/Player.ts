import type { Coordinates, CompassDirection } from '../lib/geometry';
import { checkState } from '../lib/preconditions';
import Unit from '../classes/Unit';
import type { Location } from '../lib/location';
import Inventory from './Inventory';

type Props = Readonly<{
  unit: Unit,
  location: Location,
  coordinates: Coordinates,
  direction: CompassDirection,
}>;

type MoveParams = Readonly<{
  location?: Location,
  coordinates?: Coordinates,
  direction?: CompassDirection,
}>;

class Player {
  private readonly unit: Unit;
  private location: Location;
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

  getUnit = (): Unit => this.unit;
  getLocation = (): Location => this.location;

  spendGold = (amount: number) => {
    checkState(this.gold >= amount);
    this.gold -= amount;
  };

  moveTo = ({ location, coordinates, direction }: MoveParams) => {
    this.location = location ?? this.location;
    this.coordinates = coordinates ?? this.coordinates;
    this.direction = direction ?? this.direction;
  };
}

export default Player;
