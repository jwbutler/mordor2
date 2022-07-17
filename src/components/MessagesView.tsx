import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import styles from './MessagesView.module.css';

type Props = {
  messages: string[]
};

const MessagesView = ({ messages }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [snapToBottom, setSnapToBottom] = useState(true);
  
  useEffect(() => {
    const textarea = ref.current;
    if (textarea && snapToBottom) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [messages, snapToBottom]);
  
  const handleScroll = (e: SyntheticEvent) => {
    const textarea = ref.current;
    if (textarea) {
      setSnapToBottom(textarea.scrollTop >= textarea.scrollHeight - textarea.clientHeight);
    }
  };
  
  return (
    <textarea
      ref={ref}
      className={styles.textarea}
      value={messages.join('\n')}
      onScroll={handleScroll}
      readOnly
    />
  );
};

export default MessagesView;
