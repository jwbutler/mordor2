let BUSY = false;

export const playAudio = async (sound: string, durationMs?: number) => {
  if (BUSY) {
    return;
  }
  BUSY = true;
  const audio = new Audio(sound);
  audio.volume = 0.5;
  await audio.play();

  await new Promise<void>(resolve => {
    setTimeout(
      () => {
        BUSY = false;
        resolve();
      },
      durationMs ?? (audio.duration * 1000)
    );
  });
};

let soundData: string | null = null;
let music: HTMLAudioElement | null = null;

export const playLoop = async (sound: string) => {
  if (soundData === sound) {
    return;
  }

  if (music) {
    music.pause();
    music = null; // I hope Javascript knows how to garbage collect
  }

  soundData = sound;
  music = new Audio(sound);
  music.volume = 0.5;
  music.loop = true;
  await music.play();
};
