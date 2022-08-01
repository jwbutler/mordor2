import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = (props: Props) => {
  const className = (props.className) ? `${styles.button} ${props.className}` : styles.button;
  return (
    <button {...props} className={className}>
      {props.children}
    </button>
  );
};

export default Button;
