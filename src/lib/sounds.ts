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
      durationMs || (audio.duration * 1000)
    );
  });
};

let MUSIC = false;

export const playLoop = async (sound: string) => {
  if (MUSIC) {
    return;
  }

  MUSIC = true;
  const audio = new Audio(sound);
  audio.volume = 0.5;
  audio.loop = true;
  return audio.play();
};
