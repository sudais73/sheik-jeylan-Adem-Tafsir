import {
  deleteAllDownloadedEpisodes,
  deleteDownloadedEpisode,
  formatFileSize,
  getDownloadedEpisodesSize,
  isEpisodeDownloaded,
} from "@/features/audio/download-service";
import { useEffect, useState } from "react";
import {
  Alert, Pressable, Text, View
} from "react-native";

import { useAudio } from "@/features/audio/AudioProvider";
import { surahs } from "@/features/tafsiira/data";

export default function DownloadsScreen() {
  const { playAudio, currentAudio, status } = useAudio();
  const [totalSize, setTotalSize] = useState(0);
  const [downloadedEpisodes, setDownloadedEpisodes] = useState<typeof surahs[number]["episodes"]>([]);
  async function handleDelete(episodeId: string) {
    deleteDownloadedEpisode(episodeId);

    setDownloadedEpisodes((current) => {
      const updated = current.filter(
        (episode) => episode.id !== episodeId
      );

      setTotalSize(
        getDownloadedEpisodesSize(
          updated.map((episode) => episode.id)
        )
      );

      return updated;
    });
  }
  function handleDeleteAll() {
    if (downloadedEpisodes.length === 0) {
      return;
    }

    Alert.alert(
      "Delete all downloads?",
      `This will remove ${downloadedEpisodes.length} downloaded episode${downloadedEpisodes.length === 1 ? "" : "s"
      } from your device.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            deleteAllDownloadedEpisodes();

            setDownloadedEpisodes([]);
            setTotalSize(0);
          },
        },
      ]
    );
  }

  function handlePlay(episode: (typeof downloadedEpisodes)[number]) {
    playAudio({
      id: episode.id,
      title: episode.title,
      subtitle: `Episode ${episode.episode}`,
      audioUrl:
        episode.audioUrl ??
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    });
  }

  useEffect(() => {
    async function loadDownloads() {
      const episodes = surahs.flatMap(
        (surah) => surah.episodes
      );

      const downloaded = [];

      for (const episode of episodes) {
        const exists =
          await isEpisodeDownloaded(episode.id);

        if (exists) {
          downloaded.push(episode);
        }
      }

      setDownloadedEpisodes(downloaded);
      const size = getDownloadedEpisodesSize(
        downloaded.map((episode) => episode.id)
      );

      setDownloadedEpisodes(downloaded);
      setTotalSize(size);
    }

    loadDownloads();

  }, []);

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-3xl font-bold text-gray-900">
        Downloads
      </Text>

      <Text className="mt-2 text-gray-500">
        Your downloaded Tafsiira episodes
      </Text>
      <View className="mt-6 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-green-50 p-4">
          <Text className="text-sm text-gray-500">
            Episodes
          </Text>

          <Text className="mt-1 text-2xl font-bold text-gray-900">
            {downloadedEpisodes.length}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl bg-blue-50 p-4">
          <Text className="text-sm text-gray-500">
            Storage used
          </Text>

          <Text className="mt-1 text-2xl font-bold text-gray-900">
            {formatFileSize(totalSize)}
          </Text>
        </View>

      </View>
      {downloadedEpisodes.length > 0 && (
        <Pressable
          onPress={handleDeleteAll}
          className="mt-6 rounded-xl border border-red-200 bg-red-50 py-3"
        >
          <Text className="text-center font-semibold text-red-600">
            Delete All Downloads
          </Text>
        </Pressable>
      )}
      {downloadedEpisodes.length === 0 ? (
        <View className="mt-12 items-center">
          <Text className="text-gray-500">
            No downloaded episodes yet.
          </Text>
        </View>
      ) : (
        <View className="mt-8">
          {downloadedEpisodes.map((episode) => (
            <View
              key={episode.id}
              className="mb-3 rounded-2xl border border-gray-200 bg-white p-4"
            >
              <Text className="text-lg font-semibold text-gray-900">
                {episode.title}
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Episode {episode.episode}
              </Text>

              <Text className="mt-1 text-sm text-gray-400">
                {episode.duration}
              </Text>

              <View className="mt-4 flex-row gap-3">
                <Pressable
                  onPress={() => handlePlay(episode)}
                  className="rounded-lg bg-green-700 px-5 py-2"
                >
                  <Text className="font-semibold text-white">
                    {currentAudio?.id === episode.id &&
                      status.playing
                      ? "Playing"
                      : "Play"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(episode.id)}
                  className="rounded-lg bg-red-100 px-5 py-2"
                >
                  <Text className="font-semibold text-red-600">
                    Delete
                  </Text>
                </Pressable>
              </View>


            </View>
          ))}
        </View>
      )}
    </View>
  );
}