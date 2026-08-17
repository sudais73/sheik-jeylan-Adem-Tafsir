import { SurahCard } from "@/components/SurahCard";
import { surahs } from "@/features/tafsiira/data";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-5 pb-8 pt-14"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View>
        <Text className="text-sm text-gray-500">
          Assalaamu Alaikum 👋
        </Text>

        <Text className="mt-1 text-3xl font-bold text-gray-900">
          Tafsiira Jeylan
        </Text>

        <Text className="mt-1 text-base text-gray-500">
          Tafsiira Qur'aanaa Afaan Oromoo
        </Text>
      </View>

      {/* Search */}
      <View className="mt-6 rounded-2xl bg-gray-100 px-4 py-4">
        <Text className="text-gray-400">
          🔎  Search tafsiira...
        </Text>
      </View>

      {/* Surahs */}
      <View className="mt-8">
        <Text className="mb-4 text-xl font-bold text-gray-900">
          Tafsiira Qur'aanaa
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3"
        >
          {surahs.map((surah) => (
            <SurahCard
              key={surah.id}
              nameArabic={surah.nameArabic}
              nameOromo={surah.nameOromo}
              episodes={surah.episodes.length}
              onPress={() => router.push(`/surah/${surah.id}`)}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}