import type { Episode } from "./data";
import { surahs } from "./data";

export function getNextEpisode(
  currentEpisodeId: string
): Episode | null {
  const episodes = surahs.flatMap(
    (surah) => surah.episodes
  );

  const currentIndex = episodes.findIndex(
    (episode) => episode.id === currentEpisodeId
  );

  if (currentIndex === -1) {
    return null;
  }

  return episodes[currentIndex + 1] ?? null;
}