type Props = {
  onExit: () => void
};

const TownView = ({ onExit }: Props) => {
  return (
    <div>
      hello I am a town
      <button onClick={onExit}>Exit</button>
    </div>
  );
};

export default TownView;
