import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getNextEpisode } from "../tafsiira/utils";

import { setAudioModeAsync } from "expo-audio";
import { surahs } from "../tafsiira/data";
import {
  loadPlaybackPosition,
  savePlaybackPosition,
} from "./audio-storage";
import type { AudioItem } from "./types";
type AudioContextValue = {
  player: ReturnType<typeof useAudioPlayer>;
  status: ReturnType<typeof useAudioPlayerStatus>;
  currentAudio: AudioItem | null;
  autoNextAudio: AudioItem | null;
  playAudio: (audio: AudioItem) => void;
  pauseAudio: () => void;
  stopAudio: () => void;
};

type AudioProviderProps = {
  children: ReactNode;
};

const AudioContext =
  createContext<AudioContextValue | null>(null);

const TEST_AUDIO_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export function AudioProvider({
  children,
}: AudioProviderProps) {
  const [currentAudio, setCurrentAudio] =
    useState<AudioItem | null>(null);

  const [autoNextAudio, setAutoNextAudio] =
    useState<AudioItem | null>(null);

  const [hasRestoredPlayback, setHasRestoredPlayback] =
    useState(false);

  const player = useAudioPlayer(null);

  const status = useAudioPlayerStatus(player);
  useEffect(() => {
    async function configureAudio() {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
      });
    }

    configureAudio();
  }, []);
  // --------------------------------
  // 1. Load saved playback
  // --------------------------------
  useEffect(() => {
    async function restorePlayback() {
      const saved = await loadPlaybackPosition();

      if (!saved) {
        console.log("💾 No saved playback found.");
        setHasRestoredPlayback(true);
        return;
      }

      console.log(
        "💾 SAVED PLAYBACK FOUND:",
        saved
      );

      const episode = surahs
        .flatMap((surah) => surah.episodes)
        .find(
          (episode) =>
            episode.id === saved.episodeId
        );

      if (!episode) {
        console.log(
          "⚠️ Saved episode no longer exists:",
          saved.episodeId
        );

        setHasRestoredPlayback(true);
        return;
      }

      const audio: AudioItem = {
        id: episode.id,
        title: episode.title,
        subtitle: `Episode ${episode.episode}`,
        audioUrl:
          episode.audioUrl ??
          TEST_AUDIO_URL,
      };

      console.log(
        "🔄 RESTORING AUDIO:",
        audio.id,
        saved.position
      );

      player.replace(audio.audioUrl);

      setCurrentAudio(audio);

      // Wait until the audio source is loaded
      setTimeout(() => {
        player.seekTo(saved.position);

        console.log(
          "⏩ RESTORED POSITION:",
          saved.position
        );
      }, 500);

      setHasRestoredPlayback(true);
    }

    restorePlayback();
  }, []);

  // --------------------------------
  // 2. Save playback position
  // --------------------------------
  useEffect(() => {
    if (!currentAudio) {
      return;
    }

    if (
      !Number.isFinite(status.currentTime) ||
      status.currentTime <= 0
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      savePlaybackPosition({
        episodeId: currentAudio.id,
        position: status.currentTime,
      });

      console.log(
        "💾 SAVED:",
        currentAudio.id,
        status.currentTime
      );
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    currentAudio,
    status.currentTime,
  ]);
  async function saveCurrentPosition() {
    if (!currentAudio) {
      return;
    }

    if (
      !Number.isFinite(status.currentTime) ||
      status.currentTime <= 0
    ) {
      return;
    }

    await savePlaybackPosition({
      episodeId: currentAudio.id,
      position: status.currentTime,
    });

    console.log(
      "💾 SAVED:",
      currentAudio.id,
      status.currentTime
    );
  }
  // --------------------------------
  // 3. Detect audio completion
  // --------------------------------
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

    const nextAudio: AudioItem = {
      id: nextEpisode.id,
      title: nextEpisode.title,
      subtitle: `Episode ${nextEpisode.episode}`,
      audioUrl:
        nextEpisode.audioUrl ??
        TEST_AUDIO_URL,
    };

    player.replace(nextAudio.audioUrl);

    setCurrentAudio(nextAudio);

    setAutoNextAudio(nextAudio);
player.setActiveForLockScreen(
  true,
  {
    title: nextAudio.title,
    artist: "Sheikh Jeylan Adam",
    albumTitle: "Tafsiira Jeylan",
  },
  {
    showSeekBackward: true,
    showSeekForward: true,
  }
);
    player.play();
  }, [
    status.currentTime,
    status.duration,
    currentAudio,
  ]);

  // --------------------------------
  // 4. Play an episode
  // --------------------------------
  function playAudio(audio: AudioItem) {

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
    player.setActiveForLockScreen(
  true,
  {
    title: audio.title,
    artist: "Sheikh Jeylan Adam",
    albumTitle: "Tafsiira Jeylan",
  },
  {
    showSeekBackward: true,
    showSeekForward: true,
  }
);
    player.play();
  }
  async function pauseAudio() {
    await saveCurrentPosition();

    player.pause();
  }
  // --------------------------------
  // 5. Stop audio
  // --------------------------------
  function stopAudio() {
  player.pause();
  player.setActiveForLockScreen(false);
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
        pauseAudio,
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
    throw new Error(
      "useAudio must be used inside AudioProvider"
    );
  }

  return context;
}