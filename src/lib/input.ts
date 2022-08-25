import { GameState } from '../classes/GameState';
import { navigate } from './actions';
import type { RelativeDirection } from './geometry';

const getRelativeDirection = (e: KeyboardEvent): RelativeDirection | null => {
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      return 'forward';
    case 'ArrowLeft':
    case 'KeyA':
      return 'left';
    case 'ArrowRight':
    case 'KeyD':
      return 'right';
    case 'ArrowDown':
    case 'KeyS':
      return 'backward';
    default:
      return null;
  }
};

const isDirectionKey = (e: KeyboardEvent) => getRelativeDirection(e) !== null;
const isNumberKey = (e: KeyboardEvent) => parseInt(e.key) >= 0 && parseInt(e.key) <= 9;

const handleKeyDown = async (e: KeyboardEvent) => {
  const state = GameState.getInstance();
  const player = state.getPlayer();
  if (isDirectionKey(e)) {
    const relativeDirection = getRelativeDirection(e);

    if (state.getMenu() === null && state.inputEnabled()) {
      if (relativeDirection) {
        await navigate(relativeDirection);
      }
    }
  } else if (isNumberKey(e)) {
    if (state.getMenu() === 'combat') {
      // TODO
    }
  }
};

export {
  getRelativeDirection,
  handleKeyDown
};
