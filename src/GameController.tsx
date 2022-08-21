import { useEffect, useState } from 'react';
import { GameState } from './classes/GameState';
import GameView from './components/GameView';
import { navigate } from './lib/actions';
import { getRelativeDirection } from './lib/input';

const GameController = () => {
  const state = GameState.getInstance();

  const handleKeyDown = async (e: KeyboardEvent) => {
    const relativeDirection = getRelativeDirection(e);
    const player = state.getPlayer();

    if (state.getMenu() === null && state.inputEnabled()) {
      if (relativeDirection) {
        await navigate(relativeDirection);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line
  }, []);

  return (
    <GameView />
  );
};

export default GameController;
