import { Pressable, Text } from "react-native";

type SurahCardProps = {
  nameArabic: string;
  nameOromo: string;
  episodes: number;
  onPress?: () => void;
};

export function SurahCard({
  nameArabic,
  nameOromo,
  episodes,
  onPress,
}: SurahCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-40 rounded-2xl border border-gray-200 bg-white p-4 active:bg-gray-50"
    >
      <Text className="mb-2 text-right text-xl text-gray-800">
        {nameArabic}
      </Text>

      <Text className="text-lg font-semibold text-gray-900">
        {nameOromo}
      </Text>

      <Text className="mt-1 text-sm text-gray-500">
        {episodes} {episodes === 1 ? "episode" : "episodes"}
      </Text>
    </Pressable>
  );
}