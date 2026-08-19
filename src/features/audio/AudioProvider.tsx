import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getNextEpisode } from '../tafsiira/utils';
import type { AudioItem } from "./types";
type AudioContextValue = {
  player: ReturnType<typeof useAudioPlayer>;
  status: ReturnType<typeof useAudioPlayerStatus>;
  currentAudio: AudioItem | null;
  autoNextAudio: AudioItem | null;
  playAudio: (audio: AudioItem) => void;
  stopAudio: () => void;
};

type AudioProviderProps = {
    children: ReactNode
}

const AudioContext = createContext<AudioContextValue | null>(null)


export function AudioProvider({
  children,
}: AudioProviderProps) {
  const [currentAudio, setCurrentAudio] =
    useState<AudioItem | null>(null);
const [autoNextAudio, setAutoNextAudio] =
  useState<AudioItem | null>(null);
  const player = useAudioPlayer(null);

  const status = useAudioPlayerStatus(player);

  useEffect(() => {
  if (!currentAudio) {
    return;
  }

  if (
    status.duration <= 0 ||
    status.currentTime < status.duration
  ) {
    return;
  }

  console.log(
    "🎵 AUDIO FINISHED:",
    currentAudio.id
  );

  const nextEpisode = getNextEpisode(
    currentAudio.id
  );

  // No next episode
  if (!nextEpisode) {
    console.log("🏁 No more episodes.");

    player.pause();
    player.seekTo(0);

    return;
  }

  console.log(
    "⏭️ NEXT EPISODE:",
    nextEpisode.id
  );

  const nextAudio = {
    id: nextEpisode.id,
    title: nextEpisode.title,
    subtitle: `Episode ${nextEpisode.episode}`,
    audioUrl:
      nextEpisode.audioUrl ??
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

 player.replace(nextAudio.audioUrl);
setCurrentAudio(nextAudio);
setAutoNextAudio(nextAudio);
player.play();
}, [
  status.currentTime,
  status.duration,
  currentAudio,
]);
  
function playAudio(audio: AudioItem) {
  console.log("PLAY AUDIO:", audio);

  if (!audio.audioUrl) {
    console.error(
      "❌ Audio URL is missing:",
      audio
    );
    return;
  }

  if (currentAudio?.id !== audio.id) {
    player.replace(audio.audioUrl);
    player.seekTo(0);
    setCurrentAudio(audio);
  }

  player.play();
}

  function stopAudio() {
    player.pause();
    setCurrentAudio(null);
  }

  return (
    <AudioContext.Provider
      value={{
         player,
    status,
    currentAudio,
    autoNextAudio,
    playAudio,
    stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used inside Audio Provider')
    }
    return context;
}