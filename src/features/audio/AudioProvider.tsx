import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AudioItem } from "./types";

type AudioContextValue = {
    player: ReturnType<typeof useAudioPlayer>;
    status: ReturnType<typeof useAudioPlayerStatus>;
    currentAudio: AudioItem | null;
    playAudio: (audio: AudioItem) => void;
    stopAudio: () => void
}

type AudioProviderProps = {
    children: ReactNode
}

const AudioContext = createContext<AudioContextValue | null>(null)


export function AudioProvider({
  children,
}: AudioProviderProps) {
  const [currentAudio, setCurrentAudio] =
    useState<AudioItem | null>(null);

  const player = useAudioPlayer(null);

  const status = useAudioPlayerStatus(player);

  console.log("AUDIO STATUS:", {
    playing: status.playing,
    currentTime: status.currentTime,
    duration: status.duration,
    currentAudio: currentAudio?.id,
  });

  function playAudio(audio: AudioItem) {
    console.log("PLAY AUDIO:", audio);

    if (!audio.audioUrl) {
      console.error("❌ Audio URL is missing:", audio);
      return;
    }

    if (currentAudio?.id !== audio.id) {
      player.replace(audio.audioUrl);
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