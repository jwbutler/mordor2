import { useEffect, useRef } from 'react';
import DungeonRenderer from '../classes/DungeonRenderer';
import { GameState } from '../classes/GameState';
import { playLoop } from '../lib/sounds';
import dungeon_music_mp3 from '../sounds/dungeon_music.mp3';
import styles from './DungeonView.module.css';

const renderer = new DungeonRenderer();
let rendering = false;

const DungeonView = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const canvas = ref.current;
  const state = GameState.getInstance();

  useEffect(() => {
    setTimeout(() => {
      playLoop(dungeon_music_mp3).then(() => {});
    }, 3000);
  }, []);

  useEffect(() => {
    (async () => {
      if (canvas && !rendering) {
        rendering = true;
        const buffer = document.createElement('canvas');
        buffer.width = canvas.width;
        buffer.height = canvas.height;
        await renderer.renderTiles(buffer);
        const bufferContext = buffer.getContext('2d')!;
        const imageData = bufferContext.getImageData(0, 0, buffer.width, buffer.height);
        const canvasContext = canvas.getContext('2d')!;
        canvasContext.putImageData(imageData, 0, 0);
        rendering = false;
      }
    })();
  });

  return (
    <>
      <canvas
        ref={ref}
        className={styles.dungeon}
        width={640}
        height={480}
      />
      <canvas
        className={styles.buffer}
        width={640}
        height={480}
      />
    </>
  );
};

export default DungeonView;
