import { surahs } from "@/features/tafsiira/data";
import {
    useAudioPlayer,
    useAudioPlayerStatus,
} from "expo-audio";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

const TEST_AUDIO =
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

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
export default function EpisodeScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const episode = surahs
        .flatMap((surah) => surah.episodes)
        .find((item) => item.id === id);

    const player = useAudioPlayer(TEST_AUDIO);
    const status = useAudioPlayerStatus(player);
    if (!episode) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Text className="text-lg text-gray-500">
                    Episode not found.
                </Text>
            </View>
        );
    }
    function handlePlayPause() {
        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
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

                {/* Player */}
                <View className="mt-12 w-full">
                    {/* Progress bar */}
                    <View className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <View
                            className="h-full rounded-full bg-green-700"
                            style={{
                                width:
                                    status.duration > 0
                                        ? `${(status.currentTime / status.duration) * 100}%`
                                        : "0%",
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

                    {/* Play/Pause */}
                    <Pressable
                        onPress={handlePlayPause}
                        className="mt-6 h-16 items-center justify-center rounded-full bg-green-700 active:bg-green-800"
                    >
                        <Text className="text-lg font-semibold text-white">
                            {status.playing ? "⏸ Pause" : "▶ Play"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
}