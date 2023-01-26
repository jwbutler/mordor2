import { getTile } from '../lib/levels';
import type { Level } from '../lib/levels';
import Player from './Player';
import { checkNotNull } from '../lib/preconditions';
import Shop from './Shop';
import type { Tile } from '../lib/tiles';
import Unit from '../classes/Unit';
import Trainer from './Trainer';

type Menu = 'character' | 'combat' | 'intro' | 'inventory' | 'level_up';

type Props = Readonly<{
  level: Level | null,
  player: Player | null,
  menu: Menu | null,
  shop: Shop,
  trainer: Trainer
}>;

type CombatState = Readonly<{
  attacker: Unit,
  defender: Unit
}>;

class GameState {
  private player: Player | null;
  private readonly messages: string[];
  private level: Level | null;
  private _enableInput: boolean;
  private menu: Menu | null;
  private combatState: CombatState | null;
  private readonly shop: Shop;
  private readonly trainer: Trainer;

  constructor({ level, player, menu, shop, trainer }: Props) {
    this.player = player;
    this.level = level;
    this._enableInput = true;
    this.messages = [];
    this.menu = menu;
    this.combatState = null;
    this.shop = shop;
    this.trainer = trainer;
  }

  getLevel = (): Level => checkNotNull(this.level);
  setLevel = (level: Level) => { this.level = level; };

  getPlayer = (): Player => checkNotNull(this.player);
  setPlayer = (player: Player) => { this.player = player; };

  getMenu = (): Menu | null => this.menu;
  setMenu = (menu: Menu | null) => { this.menu = menu; };
  getMessages = () => [...this.messages];
  addMessage = (message: string) => this.messages.push(message);
  disableInput = () => { this._enableInput = false; };
  enableInput = () => { this._enableInput = true; };
  inputEnabled = () => this._enableInput;
  getCombatState = () => this.combatState;
  setCombatState = (combatState: CombatState | null) => { this.combatState = combatState; };
  getShop = () => this.shop;
  getTrainer = () => this.trainer;

  getCurrentTile = (): Tile => checkNotNull(getTile(this.getLevel(), this.getPlayer().coordinates));

  private static instance: GameState | null;
}

export {
  GameState,
  type Menu
}
