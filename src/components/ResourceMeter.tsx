import styles from './ResourceMeter.module.css';

type ResourceType = 'life' | 'mana' | 'experience' | 'ap';

type Props = {
  type: ResourceType,
  current: number,
  max: number
};

const ResourceMeter = ({ type, current, max }: Props) => {
  const percent = 100 * current / max;
  const level = (percent >= 0.75) ? 'high'
    : (percent >= 0.50) ? 'medium'
    : (percent >= 0.25) ? 'low'
    : 'critical';
  return (
    <div className={styles.meter}>
      {(current > 0) && ( 
        <div
          className={`${styles.current} ${styles[type]} ${styles[level]}`}
          style={{ width: `${percent}%` }}
        />
      )}
    </div>
  );
};

export default ResourceMeter;
