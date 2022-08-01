import styles from './ControlsView.module.css';
import { navigate } from '../lib/actions';
import arrow_up_png from '../images/gen/arrow_up.png';
import arrow_down_png from '../images/gen/arrow_down.png';
import arrow_left_png from '../images/gen/arrow_left.png';
import arrow_right_png from '../images/gen/arrow_right.png';

const ControlsView = () => {
  return (
    <>
      <button className={`${styles.arrow} ${styles.up}`} onClick={() => navigate('forward')}>
        <img src={arrow_up_png} alt="" />
      </button>
      <button className={`${styles.arrow} ${styles.down}`} onClick={() => navigate('backward')}>
        <img src={arrow_down_png} alt="" />
      </button>
      <button className={`${styles.arrow} ${styles.left}`} onClick={() => navigate('left')}>
        <img src={arrow_left_png} alt="" />
      </button>
      <button className={`${styles.arrow} ${styles.right}`} onClick={() => navigate('right')}>
        <img src={arrow_right_png} alt="" />
      </button>
    </>
  );
};

export default ControlsView;
