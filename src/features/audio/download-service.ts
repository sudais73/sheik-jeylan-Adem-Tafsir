import { Directory, File, Paths } from "expo-file-system";
import { registerDownload, removeDownload } from "./download-manager";

const DOWNLOAD_DIRECTORY = new Directory(
  Paths.document,
  "audio"
);

export function ensureAudioDirectory() {
  if (!DOWNLOAD_DIRECTORY.exists) {
    DOWNLOAD_DIRECTORY.create();
  }
}

export async function downloadEpisode(
  episodeId: string,
  audioUrl: string,
  onProgress?: (progress: number) => void
) {
  ensureAudioDirectory();

  const destination = new File(
    DOWNLOAD_DIRECTORY,
    `${episodeId}.mp3`
  );

  if (destination.exists) {
    console.log(
      "📦 ALREADY DOWNLOADED:",
      episodeId
    );

    onProgress?.(1);

    return destination.uri;
  }

  console.log(
    "⬇️ DOWNLOADING:",
    episodeId
  );
const task = File.createDownloadTask(
  audioUrl,
  destination,
  {
    onProgress: ({
      bytesWritten,
      totalBytes,
    }) => {
      if (totalBytes <= 0) {
        return;
      }

      const progress =
        bytesWritten / totalBytes;

      onProgress?.(progress);
    },
  }
);

registerDownload(
  episodeId,
  task
);

  try {
    const downloadedFile =
      await task.downloadAsync();

    if (!downloadedFile) {
      throw new Error(
        "Download did not complete."
      );
    }

    onProgress?.(1);
    removeDownload(episodeId);

if (destination.exists) {
  destination.delete();
}

    console.log(
      "✅ DOWNLOAD COMPLETE:",
      downloadedFile.uri
    );

    return downloadedFile.uri;
  } catch (error) {
    // Remove incomplete file
    if (destination.exists) {
      destination.delete();

      console.log(
        "🗑️ INCOMPLETE DOWNLOAD DELETED:",
        episodeId
      );
    }

    throw error;
  }
}
export async function isEpisodeDownloaded(
  episodeId: string
) {
  const file = new File(
    DOWNLOAD_DIRECTORY,
    `${episodeId}.mp3`
  );

  console.log(
    "🔍 CHECK DOWNLOAD:",
    episodeId,
    
    "→",
    file.uri,
    "→ exists:",
    file.exists
  );

  return file.exists;
}

export function deleteDownloadedEpisode(
  episodeId: string
) {
  const file = new File(
    DOWNLOAD_DIRECTORY,
    `${episodeId}.mp3`
  );

  if (file.exists) {
    file.delete();
    console.log("🗑️ DELETED:", episodeId);
  }
}

export function deleteAllDownloadedEpisodes() {
  if (DOWNLOAD_DIRECTORY.exists) {
    DOWNLOAD_DIRECTORY.delete();
    console.log("🗑️ ALL AUDIO DOWNLOADS DELETED");
  }
}

export function getDownloadedAudioUri(
  episodeId: string
): string | null {
 const file = new File(
  DOWNLOAD_DIRECTORY,
  `${episodeId}.mp3`
);

console.log("🔍 LOCAL FILE:", {
  episodeId,
  uri: file.uri,
  exists: file.exists,
  size: file.size,
});

  if (!file.exists) {
    return null;
  }

  return file.uri;
}

export function debugDownloadedFile(episodeId: string) {
  const file = new File(
    DOWNLOAD_DIRECTORY,
    `${episodeId}.mp3`
  );

  console.log("🔍 FILE DEBUG:", {
    episodeId,
    uri: file.uri,
    exists: file.exists,
    size: file.size,
  });
}

export function getDownloadedEpisodesSize(
  episodeIds: string[]
) {
  let totalSize = 0;

  for (const episodeId of episodeIds) {
    const file = new File(
      DOWNLOAD_DIRECTORY,
      `${episodeId}.mp3`
    );

    if (file.exists) {
      totalSize += file.size;
    }
  }

  return totalSize;
}


export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}