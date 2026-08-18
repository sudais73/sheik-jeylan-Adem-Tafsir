import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAudio } from "./AudioProvider";

export function MiniPlayer() {
  const {
    player,
    status,
    currentAudio,
  } = useAudio();

  if (!currentAudio) {
    return null;
  }

  return (
    <SafeAreaView
      edges={["bottom"]}
      className="border-t border-gray-200 bg-white"
    >
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between">
          {/* Audio information */}
          <Pressable
  className="flex-1"
  onPress={() => {
    router.push(`/episode/${currentAudio.id}`);
  }}
>
  <Text
    className="text-base font-semibold text-gray-900"
    numberOfLines={1}
  >
    {currentAudio.title}
  </Text>

  {currentAudio.subtitle && (
    <Text
      className="mt-1 text-sm text-gray-500"
      numberOfLines={1}
    >
      {currentAudio.subtitle}
    </Text>
  )}
</Pressable>
          {/* Play / Pause */}
          <Pressable
            onPress={() => {
              if (status.playing) {
                player.pause();
              } else {
                player.play();
              }
            }}
            className="ml-4 rounded-full bg-green-700 px-4 py-2"
          >
            <Text className="font-semibold text-white">
              {status.playing ? "Pause" : "Play"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}