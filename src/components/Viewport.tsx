import { ReactNode } from 'react';
import styles from './Viewport.module.css';

type Props = Readonly<{
  children: ReactNode,
  footer?: ReactNode
}>;

export const Viewport = ({ children, footer }: Props) => {
  return (
    <div className={styles.viewport}>
      {children}
      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
};
