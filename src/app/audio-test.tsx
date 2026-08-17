import { useAudioPlayer } from "expo-audio";
import { Button, Text, View } from "react-native";

const TEST_AUDIO =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export default function AudioTestScreen() {
  const player = useAudioPlayer(TEST_AUDIO);

  function handlePlay() {
    player.play();
  }

  function handlePause() {
    player.pause();
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-2xl font-bold text-gray-900">
        Audio Test
      </Text>

      <Text className="text-center text-gray-500">
        Testing expo-audio before connecting our Tafsiira recordings.
      </Text>

      <Button title="Play" onPress={handlePlay} />

      <Button title="Pause" onPress={handlePause} />
    </View>
  );
}