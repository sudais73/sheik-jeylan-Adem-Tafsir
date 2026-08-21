import type { DownloadTask } from "expo-file-system";

const activeDownloads =
  new Map<string, DownloadTask>();

export function registerDownload(
  episodeId: string,
  task: DownloadTask
) {
  activeDownloads.set(
    episodeId,
    task
  );
}

export function removeDownload(
  episodeId: string
) {
  activeDownloads.delete(
    episodeId
  );
}

export async function cancelDownload(
  episodeId: string
) {
  const task =
    activeDownloads.get(episodeId);

  if (!task) {
    console.log(
      "⚠️ NO ACTIVE DOWNLOAD:",
      episodeId
    );

    return false;
  }

  try {
    await task.cancel();

    console.log(
      "🛑 DOWNLOAD CANCELLED:",
      episodeId
    );

    activeDownloads.delete(
      episodeId
    );

    return true;
  } catch (error) {
    console.error(
      "❌ CANCEL FAILED:",
      error
    );

    return false;
  }
}