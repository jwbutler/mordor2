let BUSY = false;

export const playAudio = async (sound: string) => {
  if (BUSY) {
    return;
  }
  BUSY = true;
  const audio = new Audio(sound);
  await audio.play();

  return new Promise<void>(resolve => {
    setTimeout(
      () => {
        BUSY = false;
        resolve();
      },
      audio.duration * 1000
    );
  });
};

export const playLoop = async (sound: string) => {
  const audio = new Audio(sound);
  audio.volume = 0.5;
  audio.loop = true;
  return audio.play();
};
