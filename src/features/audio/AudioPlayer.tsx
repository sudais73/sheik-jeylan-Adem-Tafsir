import {
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";

import { useState } from "react";
import { useAudio } from "./AudioProvider";
import type { AudioItem } from "./types";
type AudioPlayerProps = {
  audio: AudioItem;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function AudioPlayer({ audio }: AudioPlayerProps) {
    const { playAudio, pauseAudio, player,status,currentAudio} = useAudio();
    
  const [progressWidth, setProgressWidth] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const isCurrentAudio = currentAudio?.id === audio.id;

  function handlePlayPause() {
    if (!isCurrentAudio) {
      playAudio(audio);
      return;
    }

    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }

  function handleBackward() {
    player.seekTo(
      Math.max(0, status.currentTime - 10),
    );
  }

  function handleForward() {
    player.seekTo(
      Math.min(
        status.duration,
        status.currentTime + 10,
      ),
    );
  }

  function handleSeek(event: GestureResponderEvent) {
    const duration = Number(status.duration);
    const width = Number(progressWidth);
    const locationX = Number(event.nativeEvent.locationX);

    if (
      !Number.isFinite(duration) ||
      duration <= 0 ||
      !Number.isFinite(width) ||
      width <= 0 ||
      !Number.isFinite(locationX)
    ) {
      return;
    }

    const position = Math.max(
      0,
      Math.min(locationX, width)
    );

    const percentage = position / width;

    const newTime = Math.max(
      0,
      Math.min(
        percentage * duration,
        duration
      )
    );

    if (!Number.isFinite(newTime)) {
      return;
    }

    player.seekTo(newTime);
  }


  function seekFromPosition(locationX: number) {
    const duration = Number(status.duration);
    const width = Number(progressWidth);

    if (
      !Number.isFinite(duration) ||
      duration <= 0 ||
      !Number.isFinite(width) ||
      width <= 0 ||
      !Number.isFinite(locationX)
    ) {
      return;
    }

    const position = Math.max(
      0,
      Math.min(locationX, width)
    );

    const percentage = position / width;

    const newTime = Math.max(
      0,
      Math.min(
        percentage * duration,
        duration
      )
    );

    if (!Number.isFinite(newTime)) {
      return;
    }

    player.seekTo(newTime);
  }

  function handleSeekStart(
    event: GestureResponderEvent
  ) {
    setIsSeeking(true);

    seekFromPosition(
      event.nativeEvent.locationX
    );
  }
  function handleSeekMove(
    event: GestureResponderEvent
  ) {
    if (!isSeeking) {
      return;
    }

    seekFromPosition(
      event.nativeEvent.locationX
    );
  }

  function handleSeekEnd() {
    setIsSeeking(false);
  }
  const progress =
    status.duration > 0
      ? Math.min(
        100,
        Math.max(
          0,
          (status.currentTime / status.duration) * 100
        )
      )
      : 0;

  return (
    <View className="w-full bg-red-100 p-4">
      {/* Progress */}
      <View
        onLayout={(event) => {
          setProgressWidth(event.nativeEvent.layout.width);
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event) => {
          setIsSeeking(true);
          seekFromPosition(event.nativeEvent.locationX);
        }}
        onResponderMove={(event) => {
          if (!isSeeking) return;

          seekFromPosition(event.nativeEvent.locationX);
        }}
        onResponderRelease={() => {
          setIsSeeking(false);
        }}
        onResponderTerminate={() => {
          setIsSeeking(false);
        }}
        style={{
          height: 20,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Track */}
        <View
          pointerEvents="none"
          style={{
            height: 8,
            width: "100%",
            backgroundColor: "#e5e7eb",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          {/* Progress */}
          <View
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#15803d",
              borderRadius: 999,
            }}
          />
        </View>

        {/* Thumb */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: `${progress}%`,
            marginLeft: -8,
            width: isSeeking ? 18 : 16,
            height: isSeeking ? 18 : 16,
            borderRadius: 999,
            backgroundColor: "#15803d",
          }}
        />
      </View>
      {/* Time */}
      <View className="mt-2 flex-row justify-between">
        <Text className="text-xs text-gray-500">
          {formatTime(status.currentTime)}
        </Text>

        <Text className="text-xs text-gray-500">
          {formatTime(status.duration)}
        </Text>
      </View>

      {/* Controls */}
      <View className="mt-6 flex-row items-center justify-center gap-8">
        <Pressable
          onPress={handleBackward}
          className="h-12 w-12 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
        >
          <Text className="text-sm font-semibold text-gray-700">
            -10
          </Text>
        </Pressable>

        <Pressable
          onPress={handlePlayPause}
          className="h-16 w-16 items-center justify-center rounded-full bg-green-700 active:bg-green-800"
        >
          <Text className="text-xl text-white">
            {isCurrentAudio && status.playing ? "⏸" : "▶"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleForward}
          className="h-12 w-12 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
        >
          <Text className="text-sm font-semibold text-gray-700">
            +10
          </Text>
        </Pressable>
      </View>
    </View>
  );
}