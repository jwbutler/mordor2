import { returnToDungeon } from '../lib/actions';

const TownView = () => {
  return (
    <div>
      hello I am a town
      <button onClick={returnToDungeon}>
        Exit
      </button>
    </div>
  );
};

export default TownView;
