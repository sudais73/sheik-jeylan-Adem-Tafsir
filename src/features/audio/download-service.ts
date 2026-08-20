import { Directory, File, Paths } from "expo-file-system";

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
  audioUrl: string
) {
  ensureAudioDirectory();

  const destination = new File(
    DOWNLOAD_DIRECTORY,
    `${episodeId}.mp3`
  );

  // Already downloaded
  if (destination.exists) {
    console.log("📦 ALREADY DOWNLOADED:", episodeId);
    return destination.uri;
  }

  console.log("⬇️ DOWNLOADING:", episodeId);

  const downloadedFile = await File.downloadFileAsync(
    audioUrl,
    destination
  );

  console.log(
    "✅ DOWNLOAD COMPLETE:",
    downloadedFile.uri
  );

  return downloadedFile.uri;
}
// export async function isEpisodeDownloaded(
//   episodeId: string
// ) {
//   const file = new File(
//     DOWNLOAD_DIRECTORY,
//     `${episodeId}.mp3`
//   );

//   return file.exists;
// }

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