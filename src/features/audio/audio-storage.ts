import AsyncStorage from "@react-native-async-storage/async-storage";

const PLAYBACK_KEY = "@tafsiira_jeylan/playback";

export type SavedPlayback = {
  episodeId: string;
  position: number;
};

export async function savePlaybackPosition(
  playback: SavedPlayback
) {
  try {
    await AsyncStorage.setItem(
      PLAYBACK_KEY,
      JSON.stringify(playback)
    );
  } catch (error) {
    console.error(
      "❌ Failed to save playback position:",
      error
    );
  }
}

export async function loadPlaybackPosition(): Promise<SavedPlayback | null> {
  try {
    const value = await AsyncStorage.getItem(
      PLAYBACK_KEY
    );

    if (!value) {
      return null;
    }

    return JSON.parse(value) as SavedPlayback;
  } catch (error) {
    console.error(
      "❌ Failed to load playback position:",
      error
    );

    return null;
  }
}

export async function clearPlaybackPosition() {
  try {
    await AsyncStorage.removeItem(PLAYBACK_KEY);
  } catch (error) {
    console.error(
      "❌ Failed to clear playback position:",
      error
    );
  }
}