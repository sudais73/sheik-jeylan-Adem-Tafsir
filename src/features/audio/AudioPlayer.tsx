import { Pressable, Text, View } from "react-native";
import { useAudio } from "./AudioProvider";

type AudioPlayerProps = {
  audioUrl: string;
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

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
 const {playAudio,player, status, currentAudioUrl} = useAudio()

  function handlePlayPause() {
    if(currentAudioUrl !== audioUrl){
      playAudio(audioUrl);
      return;
    }
    if(status.playing){
      player.pause();

    }else{
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

  const progress =
    status.duration > 0
      ? (status.currentTime / status.duration) * 100
      : 0;

  return (
    <View className="w-full">
      {/* Progress */}
      <View className="h-2 overflow-hidden rounded-full bg-gray-200">
        <View
          className="h-full rounded-full bg-green-700"
          style={{
            width: `${progress}%`,
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
            {status.playing ? "⏸" : "▶"}
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