import { EpisodeCard } from "@/components/EpisodeCard";
import { surahs } from "@/features/tafsiira/data";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function SurahDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const surah = surahs.find((item) => item.id === id);

    if (!surah) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Text className="text-lg text-gray-500">
                    Surah not found.
                </Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: surah.nameOromo,
                }}
            />

            <ScrollView
                className="flex-1 bg-white"
                contentContainerClassName="px-5 pb-8 pt-6"
            >
                <View className="items-center">
                    <Text className="text-3xl font-bold text-gray-900">
                        {surah.nameOromo}
                    </Text>

                    <Text className="mt-2 text-2xl text-gray-700">
                        {surah.nameArabic}
                    </Text>

                    {surah.episodes.length}{" "}
                    {surah.episodes.length === 1 ? "episode" : "episodes"}
                </View>

                <View className="mt-8">
                    <Text className="mb-4 text-xl font-bold text-gray-900">
                        Tafsiira Episodes
                    </Text>

                    {surah.episodes.map((episode) => (
                        <EpisodeCard
                            key={episode.id}
                            episode={episode.episode}
                            title={episode.title}
                            duration={episode.duration}
                           onPress={() => router.push(`/episode/${episode.id}`)}
                        />
                    ))}
                </View>
            </ScrollView>
        </>
    );
}