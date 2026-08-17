import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type EpisodeCardProps = {
  episode: number;
  title: string;
  duration: string;
  onPress?: () => void;
};

export function EpisodeCard({
  episode,
  title,
  duration,
  onPress,
}: EpisodeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4 active:bg-gray-50"
    >
      <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <Ionicons name="play" size={20} color="#166534" />
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          Episode {episode}
        </Text>

        <Text className="mt-1 text-sm text-gray-500">
          {title}
        </Text>

        <Text className="mt-1 text-xs text-gray-400">
          {duration}
        </Text>
      </View>

      <Ionicons
        name="ellipsis-vertical"
        size={20}
        color="#9CA3AF"
      />
    </Pressable>
  );
}