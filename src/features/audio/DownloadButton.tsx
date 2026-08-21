import { Pressable, Text, View } from "react-native";

import {
  downloadEpisode,
} from "./download-service";

import { useDownloadStatus } from "./useDownloadStatus";

type DownloadButtonProps = {
  episodeId: string;
  audioUrl: string;
};

export function DownloadButton({
  episodeId,
  audioUrl,
}: DownloadButtonProps) {
  const {
    downloaded,
    checking,
    refresh,
  } = useDownloadStatus(episodeId);

  async function handleDownload() {
    if (downloaded) {
      return;
    }

    try {
      await downloadEpisode(
        episodeId,
        audioUrl
      );

      await refresh();
    } catch (error) {
      console.error(
        "❌ DOWNLOAD FAILED:",
        error
      );
    }
  }

  if (checking) {
    return (
      <Text className="text-sm text-gray-400">
        Checking...
      </Text>
    );
  }

  if (downloaded) {
    return (
      <View className="rounded-lg bg-green-100 px-4 py-2">
        <Text className="font-semibold text-green-700">
          ✓ Downloaded
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={handleDownload}
      className="rounded-lg bg-green-700 px-4 py-2 active:bg-green-800"
    >
      <Text className="font-semibold text-white">
        Download
      </Text>
    </Pressable>
  );
}