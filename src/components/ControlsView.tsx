import styles from './ControlsView.module.css';
import { navigate } from '../lib/actions';

const ControlsView = () => {
  return (
    <>
      <button className={`${styles.arrow} ${styles.up}`} onClick={() => navigate('forward')}>
        ↑ 
      </button>
      <button className={`${styles.arrow} ${styles.down}`} onClick={() => navigate('backward')}>
        ↓
      </button>
      <button className={`${styles.arrow} ${styles.left}`} onClick={() => navigate('left')}>
        ←
      </button>
      <button className={`${styles.arrow} ${styles.right}`} onClick={() => navigate('right')}>
        →
      </button>
    </>
  );
};

export default ControlsView;
