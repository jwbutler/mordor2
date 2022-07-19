import { ReactNode } from 'react';
import styles from './MobileOnly.module.css';

type Props = {
  children: ReactNode
};

const MobileOnly = ({ children }: Props) => (
  <div className={styles.mobileOnly}>
    {children}
  </div>
);

export default MobileOnly;
