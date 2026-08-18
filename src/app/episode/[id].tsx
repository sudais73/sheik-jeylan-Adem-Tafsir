import { AudioPlayer } from "@/features/audio/AudioPlayer";
import { surahs } from "@/features/tafsiira/data";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
const TEST_AUDIO_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
export default function EpisodeScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const episode = surahs
        .flatMap((surah) => surah.episodes)
        .find((item) => item.id === id);

    if (!episode) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Text className="text-lg text-gray-500">
                    Episode not found.
                </Text>
            </View>
        );
    }


    return (
        <>
            <Stack.Screen
                options={{
                    title: `Episode ${episode.episode}`,
                }}
            />

            <View className="flex-1 items-center bg-white px-6 pt-12">
                {/* Artwork */}
                <View className="h-40 w-40 items-center justify-center rounded-3xl bg-green-100">
                    <Text className="text-6xl">🎧</Text>
                </View>

                {/* Title */}
                <Text className="mt-8 text-center text-2xl font-bold text-gray-900">
                    {episode.title}
                </Text>

                <Text className="mt-2 text-gray-500">
                    Episode {episode.episode}
                </Text>

                <Text className="mt-1 text-gray-400">
                    {episode.duration}
                </Text>

                <AudioPlayer
                    audio={{
                        id: episode.id,
                        title: episode.title,
                        subtitle: `Episode ${episode.episode}`,
                        audioUrl: episode.audioUrl ?? TEST_AUDIO_URL
                    }}
                />
            </View>
        </>
    );
}