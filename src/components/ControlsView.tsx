import { GameState } from '../classes/GameState';
import styles from './ControlsView.module.css';
import { navigate } from '../lib/actions';
import arrow_up_png from '../images/gen/arrow_up.png';
import arrow_down_png from '../images/gen/arrow_down.png';
import arrow_left_png from '../images/gen/arrow_left.png';
import arrow_right_png from '../images/gen/arrow_right.png';

type Props = Readonly<{
  state: GameState
}>;

const ControlsView = ({ state }: Props) => {
  return (
    <>
      <button className={`${styles.arrow} ${styles.up}`} onClick={() => navigate(state, 'forward')}>
        <img src={arrow_up_png} alt="" />
      </button>
      <button className={`${styles.arrow} ${styles.down}`} onClick={() => navigate(state, 'backward')}>
        <img src={arrow_down_png} alt="" />
      </button>
      <button className={`${styles.arrow} ${styles.left}`} onClick={() => navigate(state, 'left')}>
        <img src={arrow_left_png} alt="" />
      </button>
      <button className={`${styles.arrow} ${styles.right}`} onClick={() => navigate(state, 'right')}>
        <img src={arrow_right_png} alt="" />
      </button>
    </>
  );
};

export default ControlsView;
