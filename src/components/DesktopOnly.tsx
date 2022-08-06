import { ReactNode } from 'react';
import styles from './DesktopOnly.module.css';

type Props = {
  children: ReactNode
};

const DesktopOnly = ({ children }: Props) => (
  <div className={styles.desktopOnly}>
    {children}
  </div>
);

export default DesktopOnly;
