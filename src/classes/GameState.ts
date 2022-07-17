import { getTile } from '../lib/levels';
import type { Level } from '../lib/levels';
import type { Player } from '../lib/player';
import { checkNotNull } from '../lib/preconditions';
import type { Tile } from '../lib/tiles';
import { Unit } from '../lib/units';

type Menu = 'intro' | 'combat';

type Props = {
  level: Level,
  player: Player,
  menu: Menu | null
};

type CombatState = {
  attacker: Unit,
  defender: Unit
};

class GameState {
  private level: Level;
  private player: Player;
  private _enableInput: boolean;
  private readonly messages: string[];
  private menu: Menu | null;
  private combatState: CombatState | null;
  
  constructor({ level, player, menu }: Props) {
    this.level = level;
    this.player = player;
    this._enableInput = true;
    this.messages = ['test','teest','ete','test'];
    this.menu = menu;
    this.combatState = null;
  }
  
  getLevel = (): Level => this.level;
  getPlayer = (): Player => this.player;
  getMenu = (): Menu | null => this.menu;
  setMenu = (menu: Menu | null) => { this.menu = menu; };
  getMessages = () => [...this.messages];
  addMessage = (message: string) => this.messages.push(message);
  disableInput = () => { this._enableInput = false; };
  enableInput = () => { this._enableInput = true; };
  inputEnabled = () => this._enableInput;
  getCombatState = () => this.combatState;
  setCombatState = (combatState: CombatState | null) => { this.combatState = combatState; };
  
  getCurrentTile = (): Tile => checkNotNull(getTile(this.level, this.player.coordinates));

  private static instance: GameState | null;

  static setInstance = (state: GameState) => { GameState.instance = state; };

  static getInstance = (): GameState => checkNotNull(GameState.instance);
}

export {
  GameState,
  type Menu
}
