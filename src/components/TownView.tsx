import { useEffect } from 'react';
import { GameState } from '../classes/GameState';
import { playLoop } from '../lib/sounds';
import styles from './TownView.module.css';
import town_png from '../images/gen/town.png';
import all_nighter_keyboard from '../sounds/all_nighter_keyboard.mp3';

const TownView = () => {
  useEffect(() => {
    playLoop(all_nighter_keyboard).then(() => {});
  }, []);

  const state = GameState.getInstance();
  return (
    <div className={styles.town}>
      <img className={styles.background} src={town_png} alt="" />
    </div>
  );
};

/*
      <TownButton
        text="Tavern"
        onClick={() => { state.getPlayer().location = 'shop'; }}
        position="left"
      />
      <TownButton
        text="Shop"
        onClick={() => { alert('Not implemented...'); }}
        position="center"
      />
      <TownButton
        text="Shop"
        onClick={() => { alert('Not implemented...'); }}
        position="right"
      />
      <TownButton
        text="Shop"
        onClick={() => { alert('Not implemented...'); }}
        position="right"
      />
*/

type ButtonProps = {
  text: string,
  onClick: () => void,
  position: string
};

const TownButton = ({ text, onClick, position }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[position]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TownView;
