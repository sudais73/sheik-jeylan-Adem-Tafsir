import { useEffect, useState } from "react";
import { isEpisodeDownloaded } from "./download-service";

export function useDownloadStatus(episodeId: string) {
  const [downloaded, setDownloaded] = useState(false);
  const [checking, setChecking] = useState(true);

  async function checkStatus() {
    setChecking(true);

    const exists = await isEpisodeDownloaded(episodeId);

    setDownloaded(exists);
    setChecking(false);
  }

  useEffect(() => {
    checkStatus();
  }, [episodeId]);

  return {
    downloaded,
    checking,
    refresh: checkStatus,
  };
}