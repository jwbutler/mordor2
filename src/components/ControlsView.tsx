import { RelativeDirection } from '../lib/geometry';
import styles from './ControlsView.module.css';

type Props = {
  navigate: (relativeDirection: RelativeDirection) => void;
}

const ControlsView = ({ navigate }: Props) => {
  return (
    <div className={styles.container}>
      <button className={`${styles.arrow} ${styles.up}`} onClick={() => navigate('forward')}>
        🠙
      </button>
      <button className={`${styles.arrow} ${styles.down}`} onClick={() => navigate('backward')}>
        🠛
      </button>
      <button className={`${styles.arrow} ${styles.left}`} onClick={() => navigate('left')}>
        🠘
      </button>
      <button className={`${styles.arrow} ${styles.right}`} onClick={() => navigate('right')}>
        🠚
      </button>
    </div>
  );
};

export default ControlsView;
