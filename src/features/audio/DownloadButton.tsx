import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";

import {
    downloadEpisode,
    isEpisodeDownloaded,
} from "./download-service";

type DownloadButtonProps = {
  episodeId: string;
  audioUrl: string;
};

export function DownloadButton({
  episodeId,
  audioUrl,
}: DownloadButtonProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkDownload() {
      const exists =
        await isEpisodeDownloaded(episodeId);

      if (mounted) {
        setDownloaded(exists);
      }
    }

    checkDownload();

    return () => {
      mounted = false;
    };
  }, [episodeId]);
  useEffect(() => {
  async function checkDownload() {
    const exists =
      await isEpisodeDownloaded(episodeId);

    console.log(
      "🎯 BUTTON:",
      episodeId,
      "DOWNLOADED:",
      exists
    );

    setDownloaded(exists);
  }

  checkDownload();
}, [episodeId]);

  async function handleDownload() {
    if (downloaded || downloading) {
      return;
    }

    try {
      setDownloading(true);

      await downloadEpisode(
        episodeId,
        audioUrl
      );

      setDownloaded(true);

      console.log(
        "✅ BUTTON DOWNLOAD:",
        episodeId
      );
    } catch (error) {
      console.error(
        "❌ DOWNLOAD FAILED:",
        error
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Pressable
      onPress={handleDownload}
      disabled={downloaded || downloading}
      className="mt-6 w-full items-center rounded-xl bg-gray-100 px-5 py-4 active:bg-gray-200"
    >
      <Text className="font-semibold text-gray-800">
        {downloading
          ? "Downloading..."
          : downloaded
            ? "✓ Downloaded"
            : "↓ Download"}
      </Text>
    </Pressable>
  );
}