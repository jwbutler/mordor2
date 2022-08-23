import { useEffect } from 'react';
import GameView from './components/GameView';
import { handleKeyDown } from './lib/input';

const GameController = () => {
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
