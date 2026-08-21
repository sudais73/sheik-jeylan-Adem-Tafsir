import { AudioPlayer } from "@/features/audio/AudioPlayer";
import { useAudio } from "@/features/audio/AudioProvider";
import {
    debugDownloadedFile,
} from "@/features/audio/download-service";
import { DownloadButton } from "@/features/audio/DownloadButton";
import { surahs } from "@/features/tafsiira/data";
import { getNextEpisode } from "@/features/tafsiira/utils";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
const TEST_AUDIO_URL =
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
export default function EpisodeScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { autoNextAudio } = useAudio();

    const episode = surahs
        .flatMap((surah) => surah.episodes)
        .find((item) => item.id === id);

    useEffect(() => {
        if (!autoNextAudio) {
            return;
        }

        if (autoNextAudio.id === id) {
            return;
        }

        router.replace(`/episode/${autoNextAudio.id}`);
    }, [autoNextAudio, id]);

    if (!episode) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Text className="text-lg text-gray-500">
                    Episode not found.
                </Text>
            </View>
        );
    }

    console.log(
        "NEXT EPISODE:",
        getNextEpisode(episode.id)
    );

    useEffect(() => {
        debugDownloadedFile("baqarah-1");
        debugDownloadedFile("baqarah-2");
    }, []);

    return (
        <>
            <Stack.Screen
                options={{
                    title: `Episode ${episode.episode}`,
                }}
            />

            <View className="flex-1 bg-white px-6 pt-12">
                {/* Artwork */}
                <View className="items-center">
                    <View className="h-40 w-40 items-center justify-center rounded-3xl bg-green-100">
                        <Text className="text-6xl">🎧</Text>
                    </View>
                </View>

                {/* Title */}
                <Text className="mt-8 text-center text-2xl font-bold text-gray-900">
                    {episode.title}
                </Text>

                <Text className="mt-2 text-center text-gray-500">
                    Episode {episode.episode}
                </Text>

                <Text className="mt-1 text-center text-gray-400">
                    {episode.duration}
                </Text>

                {/* Audio Player */}
                <View className="mt-8 w-full">
                    <AudioPlayer
                        audio={{
                            id: episode.id,
                            title: episode.title,
                            subtitle: `Episode ${episode.episode}`,
                            audioUrl: episode.audioUrl ?? TEST_AUDIO_URL,
                        }}
                    />
                    <View className="rounded-2xl bg-white p-4">
                        <Text className="text-lg font-semibold">
                            {episode.title}
                        </Text>

                        <Text className="mt-1 text-sm text-gray-500">
                            Episode {episode.episode}
                        </Text>

                        <View className="mt-4 flex-row items-center justify-between">
                            <Text className="text-sm text-gray-400">
                                {episode.duration}
                            </Text>

                            <DownloadButton
                                episodeId={episode.id}
                                audioUrl={
                                    episode.audioUrl ??
                                    TEST_AUDIO_URL
                                }
                            />
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}