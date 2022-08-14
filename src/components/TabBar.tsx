import styles from './TabBar.module.css';
import { ReactNode, useState } from 'react';

type Tab = {
  title: string,
  content: ReactNode
}

type Props = {
  tabs: Tab[]
};

const TabBar = ({ tabs }: Props) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].title);

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabs}>
        {tabs.map(({ title }) => (
          <button
            className={title === selectedTab ? `${styles.tab} ${styles.selected}` : styles.tab}
            key={title}
            onClick={() => setSelectedTab(title)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {tabs.find(tab => tab.title === selectedTab)?.content}
      </div>
    </div>
  );
};

export default TabBar;
export type { Tab };