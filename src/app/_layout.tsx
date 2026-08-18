import { Stack } from "expo-router";
import { View } from "react-native";
import "../../global.css";

import { AudioProvider } from "@/features/audio/AudioProvider";
import { MiniPlayer } from "@/features/audio/MiniPlayer";

export default function RootLayout() {
  return (
    <AudioProvider>
      <View className="flex-1">
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>

        <MiniPlayer />
      </View>
    </AudioProvider>
  );
}