import { useEffect } from 'react';
import DungeonRenderer from '../classes/DungeonRenderer';
import styles from './DungeonView.module.css';

const renderer = new DungeonRenderer();

const DungeonView = () => {
  const bufferElement = document.getElementById('buffer-canvas') as HTMLCanvasElement;
  const dungeonCanvas = document.getElementById('dungeon-canvas') as HTMLCanvasElement;

  useEffect(() => {
    (async () => {
      if (bufferElement && dungeonCanvas) {
        await renderer.renderTiles(bufferElement);
        const bufferContext = bufferElement.getContext('2d') as CanvasRenderingContext2D;
        const imageData = bufferContext.getImageData(0, 0, bufferElement.width, bufferElement.height);
        const dungeonContext = dungeonCanvas.getContext('2d') as CanvasRenderingContext2D;
        dungeonContext.putImageData(imageData, 0, 0);
      }
    })();
  });
  
  return (
    <>
      <canvas
        id="dungeon-canvas"
        className={styles.dungeon}
        width={640} height={480}
      />
      <canvas
        id="buffer-canvas"
        className={styles.buffer}
        width={640} height={480}
      />
    </>
  );
};

export default DungeonView;
