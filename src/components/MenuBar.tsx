import { GameState, Menu } from '../classes/GameState';
import Button from './Button';
import styles from './MenuBar.module.css';

type Props = Readonly<{
  state: GameState
}>;

const MenuBar = ({ state }: Props) => {
  const toggleMenu = (menu: Menu) => {
    state.setMenu(state.getMenu() !== menu ? menu : null);
  };

  return (
    <header className={styles.menuBar}>
      <Item onClick={() => toggleMenu('character')}>
        Character
      </Item>
      <Item onClick={() => toggleMenu('inventory')}>
        Inventory
      </Item>
    </header>
  );
};

type ItemProps = {
  children: string,
  onClick: () => void
};

const Item = ({ children, onClick }: ItemProps) => {
  return (
    <Button onClick={onClick}>
      {children}
    </Button>
  );
};

export default MenuBar;
