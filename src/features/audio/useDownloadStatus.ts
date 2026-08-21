import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { isEpisodeDownloaded } from "./download-service";

export function useDownloadStatus(episodeId: string) {
  const [downloaded, setDownloaded] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkStatus = useCallback(async () => {
    setChecking(true);

    try {
      const exists =
        await isEpisodeDownloaded(episodeId);

      setDownloaded(exists);
    } catch (error) {
      console.error(
        "❌ DOWNLOAD STATUS CHECK FAILED:",
        error
      );

      setDownloaded(false);
    } finally {
      setChecking(false);
    }
  }, [episodeId]);

  // Initial check
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Check again whenever the screen becomes active
  useFocusEffect(
    useCallback(() => {
      checkStatus();
    }, [checkStatus])
  );

  return {
    downloaded,
    checking,
    refresh: checkStatus,
  };
}