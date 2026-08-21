import { useState } from "react";
import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  downloadEpisode,
} from "./download-service";

import { cancelDownload } from "./download-manager";
import {
  useDownloadStatus,
} from "./useDownloadStatus";

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

  const [downloading, setDownloading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  async function handleDownload() {
    if (downloaded || downloading) {
      return;
    }

    try {
      setDownloading(true);
      setProgress(0);

      await downloadEpisode(
        episodeId,
        audioUrl,
        (value) => {
          setProgress(value);
        }
      );

      await refresh();
    } catch (error) {
      console.error(
        "❌ DOWNLOAD FAILED:",
        error
      );
    } finally {
      setDownloading(false);
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

 if (downloading) {
  const percentage = Math.round(
    progress * 100
  );

  return (
    <View className="w-40">
      <View className="flex-row justify-between">
        <Text className="text-xs text-gray-500">
          Downloading...
        </Text>

        <Text className="text-xs font-semibold text-green-700">
          {percentage}%
        </Text>
      </View>

      <View className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
        <View
          className="h-full bg-green-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </View>

      <Pressable
        onPress={async () => {
          const cancelled =
            await cancelDownload(
              episodeId
            );

          if (cancelled) {
            setDownloading(false);
            setProgress(0);
          }
        }}
        className="mt-2"
      >
        <Text className="text-center text-xs font-semibold text-red-600">
          Cancel
        </Text>
      </Pressable>
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