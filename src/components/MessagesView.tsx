import styles from './MessagesView.module.css';

type Props = {
  messages: string[]
};

const MessagesView = ({ messages }: Props) => {
  const n = 4;
  const messagesToDisplay = messages.slice(messages.length - n, messages.length);

  return (
    <div className={styles.textarea}>
      {messagesToDisplay.join('\n')}
    </div>
  );
};

export default MessagesView;
